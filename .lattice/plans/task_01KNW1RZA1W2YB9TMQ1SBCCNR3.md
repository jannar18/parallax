# ASMV-86: Mobile: 'Software Development + AI Research' image squishes — should stay square

src/app/page.tsx Section 2 (lines 40-80): the right cell holds /images/home/software-split.riso.1.png in a relative parent with <Image fill object-cover />. The section is grid h-screen grid-cols-1 md:grid-cols-2.

On desktop the image is half a viewport wide and full-height — close enough to square. On mobile (single column) the section is still h-screen, so each row gets ~50vh tall while spanning 100vw — a wide-and-short rectangle. The image then object-cover crops to fit, looking 'shrunken / shorter'.

Fix: on mobile the image cell should be aspect-square (or at minimum match the desktop aspect ratio). Likely change the section from h-screen to h-auto on mobile, or give the image cell aspect-square md:aspect-auto md:h-full.
