/**
 * Read image dimensions from PNG files at build time.
 * Zero external dependencies — reads the IHDR chunk directly.
 *
 * PNG format: 8-byte signature, then IHDR chunk:
 *   4 bytes length + 4 bytes "IHDR" + 4 bytes width + 4 bytes height
 *   → width at offset 16, height at offset 20 (big-endian uint32)
 */

import { openSync, readSync, closeSync } from "fs";
import { join } from "path";

export interface ImageDimensions {
  width: number;
  height: number;
}

const VIDEO_EXTENSIONS = /\.(mov|mp4|webm)$/i;
const SVG_EXTENSION = /\.svg$/i;

/**
 * Get dimensions for an image path (relative to /public).
 * - PNG: reads only the first 24 bytes (IHDR header)
 * - Video: returns 9:16 portrait default (1080x1920) — most are phone recordings
 * - SVG: returns square default (800x800)
 * - Unknown: returns square default (800x800)
 */
export function getImageDimensions(imagePath: string): ImageDimensions {
  if (VIDEO_EXTENSIONS.test(imagePath)) {
    return { width: 1080, height: 1920 };
  }

  if (SVG_EXTENSION.test(imagePath)) {
    return { width: 800, height: 800 };
  }

  let fd: number | null = null;
  try {
    const absolutePath = join(process.cwd(), "public", imagePath);
    fd = openSync(absolutePath, "r");
    const header = Buffer.alloc(24);
    const bytesRead = readSync(fd, header, 0, 24, 0);

    // Verify PNG signature (first 4 bytes: 0x89 P N G)
    if (
      bytesRead >= 24 &&
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47
    ) {
      const width = header.readUInt32BE(16);
      const height = header.readUInt32BE(20);
      return { width, height };
    }
  } catch {
    console.warn(`[image-utils] Failed to read dimensions for: ${imagePath}`);
  } finally {
    if (fd !== null) closeSync(fd);
  }

  return { width: 800, height: 800 };
}
