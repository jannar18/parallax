# ASMV-49: Extract Footer grain overlay to shared utility

Footer.tsx:17-21 duplicates the same SVG grain texture that exists in globals.css:103-110 (.grain-overlay::before). Should use the existing .grain-overlay class pattern instead of inline SVG. Found by Claude Standard review (C6).
