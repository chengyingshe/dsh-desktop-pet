# Image generation prompt

Create one production-ready character sprite sheet for a desktop pet UI, using the supplied reference only as character and costume reference. Depict Shin-chan from Crayon Shin-chan: black bowl-cut hair, thick eyebrows, large black oval eyes, red shirt, yellow shorts, white socks, yellow shoes. Flat clean 2D Japanese TV animation look with bold dark outlines, faithful recognizable proportions, no realism and no 3D.

LAYOUT: exact 3 by 3 grid, nine separate full-body poses, each centered in an equal square cell with generous padding and identical character scale and ground baseline. Pure solid bright green background (#00FF00) across the entire sheet, no borders, no panel lines, no shadows, no text, no labels, no watermark, no props crossing cell boundaries. Keep every body fully visible and isolated.

POSE ORDER left-to-right, top-to-bottom:
1 neutral idle standing, cheerful;
2 walking to the right, one foot forward;
3 running to the right, energetic;
4 sleeping curled on his side;
5 thinking with one finger on chin;
6 celebrating with both arms raised and jumping;
7 surprised, wide eyes and arms out;
8 being picked up, body dangling vertically with a mildly annoyed face;
9 talking and waving one hand.

Consistency is critical: exactly the same character design, clothing colors, line weight, scale and rendering in all nine cells. Output a single square high-resolution image.

The resulting sheet is stored as `sprite-sheet.png`; the nine cells are split into `sprites/*.png` and the bright green background is converted to transparency for runtime use.
