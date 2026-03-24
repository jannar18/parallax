import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execSync, execFileSync } from "child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, readdirSync } from "fs";
import { join, basename, parse as parsePath } from "path";
import { tmpdir } from "os";
import crypto from "crypto";

// ── Paths ──
const CLI = "/Applications/Spectrolite.app/Contents/Resources/bin/spectrolite_cli";
const PROFILES_DIR = join(
  process.env.HOME,
  "Library/Application Support/spectrolite/iccProfiles/spectrolite"
);
const SPECTROLITE_TEMP = join(tmpdir(), "spectrolite");

// ── Brand Palettes ──
const PALETTES = {
  "brand-full": {
    name: "bright olive green + moss + spruce + scarlet",
    inks: [
      { name: "bright olive green", group: "browns", color: { rgb: [180, 159, 41] } },
      { name: "moss", group: "teals", color: { rgb: [104, 114, 77] } },
      { name: "spruce", group: "teals", color: { rgb: [74, 99, 93] } },
      { name: "scarlet", group: "pinks", color: { rgb: [246, 80, 88] } },
    ],
    profileID: "b5818c85bef5c6fbb0943eadc4fd8c64",
  },
  "scarlet-spruce": {
    name: "scarlet + spruce",
    inks: [
      { name: "scarlet", group: "pinks", color: { rgb: [246, 80, 88] } },
      { name: "spruce", group: "teals", color: { rgb: [74, 99, 93] } },
    ],
    profileID: "83f2692dd5bbba699936a5c92210ba65",
  },
  "scarlet-moss": {
    name: "scarlet + moss",
    inks: [
      { name: "scarlet", group: "pinks", color: { rgb: [246, 80, 88] } },
      { name: "moss", group: "teals", color: { rgb: [104, 114, 77] } },
    ],
    profileID: "2a26ead9abdb1c7d33f37961fbad1b5c",
  },
  "scarlet-olive": {
    name: "scarlet + bright olive green",
    inks: [
      { name: "scarlet", group: "pinks", color: { rgb: [246, 80, 88] } },
      { name: "bright olive green", group: "browns", color: { rgb: [180, 159, 41] } },
    ],
    profileID: "dcff974b26d37f8c08f2104bb49afb9d",
  },
  "scarlet-mono": {
    name: "scarlet mono",
    inks: [{ name: "scarlet", group: "pinks", color: { rgb: [246, 80, 88] } }],
    profileID: null,
  },
  "spruce-mono": {
    name: "spruce mono",
    inks: [{ name: "spruce", group: "teals", color: { rgb: [74, 99, 93] } }],
    profileID: null,
  },
  "moss-mono": {
    name: "moss mono",
    inks: [{ name: "moss", group: "teals", color: { rgb: [104, 114, 77] } }],
    profileID: null,
  },
  "olive-mono": {
    name: "olive mono",
    inks: [{ name: "bright olive green", group: "browns", color: { rgb: [180, 159, 41] } }],
    profileID: null,
  },
};

// Default halftone angles per ink count (standard Riso angles to avoid moiré)
const HALFTONE_ANGLES = {
  1: [45],
  2: [75, 45],
  3: [0, 45, 75],
  4: [0, 45, 15, 75],
};

// ── Helpers ──

function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

function md5File(path) {
  return crypto.createHash("md5").update(readFileSync(path)).digest("hex");
}

function getImageInfo(imagePath) {
  return JSON.parse(
    execFileSync(CLI, ["image", "info", "-i", imagePath], { encoding: "utf-8" })
  );
}

function buildPostprocessing(effect, inkCount, baseManifestPath) {
  if (!effect || effect.type === "none") return null;

  if (effect.type === "halftone") {
    const lpi = effect.lpi || 71;
    const shape = effect.shape || "circle";
    const angles = HALFTONE_ANGLES[inkCount] || HALFTONE_ANGLES[4].slice(0, inkCount);
    return {
      method: "halftone",
      halftoneConfigs: angles.map((angle) => ({ angle, dpi: 600, shape, lpi })),
      baseManifestPath,
    };
  }

  if (effect.type === "dithering") {
    return {
      method: "dithering",
      ditheringConfig: {
        method: effect.algorithm || "floyd-steinberg",
        scaleFactor: effect.scale || 1,
        threshold: effect.threshold || 0.5,
      },
      baseManifestPath,
    };
  }

  return null;
}

function buildInputsJson(imagePath, palette, precomputedPath, workDir, options = {}) {
  const imageHash = md5File(imagePath);
  const inkCount = palette.inks.length;
  const profilePath = palette.profileID
    ? join(PROFILES_DIR, `${palette.profileID}-3.0.prof`)
    : null;

  // Copy original to working dir so CLI can find it
  const origDir = join(SPECTROLITE_TEMP, imageHash);
  mkdirSync(origDir, { recursive: true });
  const origPath = join(origDir, "original" + parsePath(imagePath).ext);
  if (!existsSync(origPath)) copyFileSync(imagePath, origPath);

  const imageInfo = getImageInfo(imagePath);

  // Build ink opacity array — default all 1, override by name
  const opacityMap = options.ink_opacity || {};
  const inkOpacities = palette.inks.map((ink) => {
    // Match by ink name (case-insensitive, partial match)
    for (const [key, val] of Object.entries(opacityMap)) {
      if (ink.name.toLowerCase().includes(key.toLowerCase())) return val;
    }
    return 1;
  });

  // Determine separation method
  const isPosterize = options.effect?.type === "posterize";
  const method = isPosterize ? "posterize" : "cmyk-ish";

  const colorSeparationInputs = {
    method,
    treatImageAsGrayscale: false,
    inkOpacityMultipliers: inkOpacities,
  };

  if (method === "cmyk-ish") {
    // CMYK channel-to-ink mapping
    // Default: each ink gets its own channel in order
    // With cmyk_map: user controls which ink handles each CMYK channel
    let inkIDs;
    let cmykOpacities;

    if (options.cmyk_map) {
      // User specified CMYK mapping — always 4 channels (C, M, Y, K)
      inkIDs = [options.cmyk_map.c, options.cmyk_map.m, options.cmyk_map.y, options.cmyk_map.k];
      // Opacities follow the 4 CMYK channels, defaulting to 1
      cmykOpacities = inkIDs.map((name) => {
        for (const [key, val] of Object.entries(opacityMap)) {
          if (name.toLowerCase().includes(key.toLowerCase())) return val;
        }
        return 1;
      });
    } else {
      inkIDs = palette.inks.map((ink) => ink.name);
      cmykOpacities = inkOpacities;
    }

    colorSeparationInputs.cmykishInputs = {
      opacities: cmykOpacities,
      inkIDs,
    };
    colorSeparationInputs.inkOpacityMultipliers = Array(inkIDs.length).fill(1);
  }

  if (isPosterize) {
    // Auto-generate breakpoints evenly across inks
    const breakpoints = [];
    const rangeToInkIndex = [];
    for (let i = 0; i < inkCount; i++) {
      breakpoints.push(((i + 1) / inkCount) * 0.95);
      rangeToInkIndex.push(inkCount - 1 - i); // darkest ink gets darkest range
    }
    colorSeparationInputs.posterizeInputs = {
      blackpointMinThreshold: 0,
      grayscaleBreakpoints: breakpoints,
      rangeToInkIndex,
    };
  }

  return {
    colorSeparationInputs,
    palette: {
      name: palette.name,
      inks: palette.inks,
      userDefined: true,
      profileID: palette.profileID || "",
    },
    profile: profilePath
      ? {
          file: { path: profilePath, name: basename(profilePath), hash: palette.profileID, originalDir: "" },
          inks: palette.inks,
          profileGenVersion: "3.0",
        }
      : {
          file: { path: "", name: "", hash: "", originalDir: "" },
          inks: palette.inks,
          profileGenVersion: "3.0",
        },
    artworkID: imageHash,
    artworkSeparationID: `${imageHash}:mcp-${Date.now()}`,
    precomputedImagePath: precomputedPath || "",
    zineImpositionInputs: null,
    printersMarks: null,
    dpi: 600,
    settings: { pdfIsRaster: false, shouldSetImageDPI: false, pdfVectorNoImages: false },
    version: "3.5",
    originalArtFile: {
      sizePixels: imageInfo.pixels,
      type: "image",
      numberPages: 1,
      dpi: 600,
      fileInfo: { path: origPath, name: basename(imagePath), hash: imageHash, originalDir: parsePath(imagePath).dir },
      thumbnails: null,
    },
    pdfTextSeparationInputs: null,
    postprocessing: null, // added in second pass if needed
    manifest: { path: join(workDir, "manifest.json"), name: "", hash: "", originalDir: "" },
  };
}

function runCli(args) {
  return execFileSync(CLI, args, {
    encoding: "utf-8",
    timeout: 120000,
    env: { ...process.env, SPECTROLITE_BIN_PATH: parsePath(CLI).dir },
  });
}

function runSeparation(imagePath, paletteName, options = {}) {
  const palette = PALETTES[paletteName];
  if (!palette) throw new Error(`Unknown palette: ${paletteName}. Available: ${Object.keys(PALETTES).join(", ")}`);

  const imageHash = md5File(imagePath);
  const sepHash = md5(paletteName + imageHash + JSON.stringify(options) + Date.now());
  const workDir = join(SPECTROLITE_TEMP, imageHash, sepHash);
  mkdirSync(workDir, { recursive: true });

  // Precompute if profile exists
  let precomputedPath = "";
  if (palette.profileID) {
    const profilePath = join(PROFILES_DIR, `${palette.profileID}-3.0.prof`);
    const expectedPath = join(SPECTROLITE_TEMP, imageHash, `${md5(palette.profileID)}.precomp`);

    if (existsSync(expectedPath)) {
      precomputedPath = expectedPath;
    } else {
      // Spectrolite GUI may have created a precomp with a different naming convention.
      // Scan the image's temp directory for any existing .precomp file.
      const imageDir = join(SPECTROLITE_TEMP, imageHash);
      if (existsSync(imageDir)) {
        const precompFiles = readdirSync(imageDir).filter((f) => f.endsWith(".precomp"));
        if (precompFiles.length > 0) {
          precomputedPath = join(imageDir, precompFiles[0]);
        }
      }

      // If still no precomp found, try to create one
      if (!precomputedPath) {
        try {
          execFileSync(CLI, ["precompute-image", "-v", "-i", imagePath, "-o", expectedPath, "-p", profilePath], {
            encoding: "utf-8",
            timeout: 60000,
          });
          precomputedPath = expectedPath;
        } catch {
          precomputedPath = "";
        }
      }
    }
  }

  // Build and write inputs
  const inputs = buildInputsJson(imagePath, palette, precomputedPath, workDir, options);
  const inputsPath = join(workDir, "inputs.json");
  writeFileSync(inputsPath, JSON.stringify(inputs));

  // Run base separation
  runCli(["separate", "separate", "-i", inputsPath, "-v"]);

  const manifestPath = join(workDir, "manifest.json");
  if (!existsSync(manifestPath)) {
    return { success: false, error: "No manifest generated" };
  }

  // If there's a postprocessing effect (halftone/dithering), run a second pass
  const effect = options.effect;
  if (effect && effect.type !== "none" && effect.type !== "posterize") {
    const postprocessing = buildPostprocessing(effect, palette.inks.length, manifestPath);
    if (postprocessing) {
      const ppId = md5(JSON.stringify(postprocessing));
      const ppDir = join(workDir, `${effect.type}-${ppId}`);
      mkdirSync(ppDir, { recursive: true });

      // Build postprocessing inputs — same as base but with postprocessing and new manifest
      const ppInputs = { ...inputs };
      ppInputs.postprocessing = { ...postprocessing, id: `${effect.type}-${ppId}` };
      ppInputs.manifest = { path: join(ppDir, "manifest.json"), name: "", hash: "", originalDir: "" };
      ppInputs.colorSeparationInputs = {
        ...ppInputs.colorSeparationInputs,
        method: "spectrolite-default", // halftone/dithering requires spectrolite-default base
      };
      delete ppInputs.colorSeparationInputs.cmykishInputs;

      const ppInputsPath = join(ppDir, "inputs.json");
      writeFileSync(ppInputsPath, JSON.stringify(ppInputs));

      runCli(["separate", "separate", "-i", ppInputsPath, "-v"]);

      const ppManifestPath = join(ppDir, "manifest.json");
      if (existsSync(ppManifestPath)) {
        const ppManifest = JSON.parse(readFileSync(ppManifestPath, "utf-8"));
        return { success: true, previewPath: ppManifest.previewPath || null, workDir: ppDir };
      }
    }
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  return { success: true, previewPath: manifest.previewPath || null, workDir };
}

// ── MCP Server ──

const server = new McpServer({ name: "spectrolite", version: "1.0.0" });

const PALETTE_ENUM = [
  "brand-full", "scarlet-spruce", "scarlet-moss", "scarlet-olive",
  "scarlet-mono", "spruce-mono", "moss-mono", "olive-mono",
];

server.tool(
  "riso",
  `Apply Risograph color separation to an image using Spectrolite's engine.

Supports effects: halftone, dithering, posterize.
Supports per-ink opacity (e.g. "turn down scarlet to 50%").
Supports CMYK channel mapping (e.g. "CMY=scarlet, K=spruce").

Examples:
  - Simple: riso image.png brand-full
  - Halftone: riso image.png scarlet-moss effect=halftone
  - Dithering: riso image.png spruce-mono effect=dithering algorithm=atkinson
  - Posterize: riso image.png scarlet-spruce effect=posterize
  - Opacity: riso image.png brand-full ink_opacity={"scarlet":0.5}
  - CMYK map: riso image.png scarlet-spruce cmyk_map={"c":"scarlet","m":"scarlet","y":"scarlet","k":"spruce"}
  - Shorthand: "CMY=scarlet K=spruce" → cmyk_map={"c":"scarlet","m":"scarlet","y":"scarlet","k":"spruce"}`,
  {
    image_path: z.string().describe("Absolute path to the source image (PNG, JPG)"),
    palette: z.enum(PALETTE_ENUM).default("brand-full").describe("Palette preset"),
    effect: z
      .enum(["none", "halftone", "dithering", "posterize"])
      .default("none")
      .describe("Post-processing effect"),
    lpi: z.number().default(71).describe("Halftone lines per inch (71=coarse, 108=medium, 160=fine). Only for halftone."),
    halftone_shape: z.enum(["circle", "diamond", "square", "line"]).default("circle").describe("Halftone dot shape"),
    dither_algorithm: z
      .enum(["floyd-steinberg", "atkinson", "stucki", "burkes", "sierra"])
      .default("floyd-steinberg")
      .describe("Dithering algorithm. Only for dithering effect."),
    ink_opacity: z
      .record(z.string(), z.number())
      .optional()
      .describe('Per-ink opacity 0-1, keyed by ink name. E.g. {"scarlet":0.5, "moss":0.7}'),
    cmyk_map: z
      .object({
        c: z.string().describe("Ink name for Cyan channel"),
        m: z.string().describe("Ink name for Magenta channel"),
        y: z.string().describe("Ink name for Yellow channel"),
        k: z.string().describe("Ink name for Key/Black channel"),
      })
      .optional()
      .describe('Map CMYK channels to ink names. E.g. {"c":"scarlet","m":"scarlet","y":"scarlet","k":"spruce"}. Shorthand: "CMY=scarlet K=spruce".'),
    output_path: z.string().optional().describe("Where to save output PNG (default: Artifacts/processed/ mirror of source path, or source dir with -riso suffix)"),
  },
  async ({ image_path, palette, effect, lpi, halftone_shape, dither_algorithm, ink_opacity, cmyk_map, output_path }) => {
    try {
      if (!existsSync(image_path)) {
        return { content: [{ type: "text", text: `Error: File not found: ${image_path}` }] };
      }

      const options = {
        ink_opacity: ink_opacity || {},
        cmyk_map: cmyk_map || null,
        effect:
          effect === "none"
            ? null
            : effect === "halftone"
              ? { type: "halftone", lpi, shape: halftone_shape }
              : effect === "dithering"
                ? { type: "dithering", algorithm: dither_algorithm }
                : { type: "posterize" },
      };

      const result = runSeparation(image_path, palette, options);

      if (!result.success) {
        return { content: [{ type: "text", text: `Separation failed: ${result.error}` }] };
      }

      const dest =
        output_path ||
        (() => {
          const p = parsePath(image_path);
          const suffix = effect !== "none" ? `-riso-${effect}` : "-riso";
          // If source is under Artifacts/raw/, output to the mirror path under Artifacts/processed/
          const rawPrefix = join(process.env.HOME, "Documents/Artifacts/raw");
          if (p.dir.startsWith(rawPrefix)) {
            const relDir = p.dir.slice(rawPrefix.length); // e.g. "/software/rainbow-crawler"
            return join(process.env.HOME, "Documents/Artifacts/processed", relDir, `${p.name}${suffix}.png`);
          }
          return join(p.dir, `${p.name}${suffix}.png`);
        })();

      mkdirSync(parsePath(dest).dir, { recursive: true });
      copyFileSync(result.previewPath, dest);

      const parts = [`Riso complete (${palette}${effect !== "none" ? ` + ${effect}` : ""})`, `Output: ${dest}`];
      if (ink_opacity && Object.keys(ink_opacity).length > 0) {
        parts.push(`Ink opacity: ${Object.entries(ink_opacity).map(([k, v]) => `${k}=${Math.round(v * 100)}%`).join(", ")}`);
      }

      return { content: [{ type: "text", text: parts.join("\n") }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}\n\n${err.stderr || ""}` }] };
    }
  }
);

server.tool(
  "list_palettes",
  "List all available Riso palette presets with their ink colors.",
  {},
  async () => {
    const lines = Object.entries(PALETTES).map(([key, pal]) => {
      const inks = pal.inks.map((i) => `${i.name} rgb(${i.color.rgb.join(",")})`).join(" + ");
      return `${key}: ${inks}`;
    });
    return { content: [{ type: "text", text: lines.join("\n") }] };
  }
);

server.tool(
  "image_info",
  "Get image dimensions and format info.",
  { image_path: z.string().describe("Absolute path to the image") },
  async ({ image_path }) => {
    try {
      const info = getImageInfo(image_path);
      return {
        content: [{ type: "text", text: `${basename(image_path)}: ${info.pixels.width}x${info.pixels.height} ${info.format}` }],
      };
    } catch (err) {
      return { content: [{ type: "text", text: `Error: ${err.message}` }] };
    }
  }
);

server.tool(
  "open_in_spectrolite",
  "Open an image in the Spectrolite GUI for manual editing.",
  { image_path: z.string().describe("Absolute path to the image to open") },
  async ({ image_path }) => {
    try {
      execSync(`open -a Spectrolite "${image_path}"`);
      return { content: [{ type: "text", text: `Opened ${basename(image_path)} in Spectrolite` }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error opening Spectrolite: ${err.message}` }] };
    }
  }
);

// ── Start ──
const transport = new StdioServerTransport();
await server.connect(transport);
