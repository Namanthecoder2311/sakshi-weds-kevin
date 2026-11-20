# Sakshi weds Kevin

A 3D wedding invitation card that comes alive as you scroll.

- **Opening (like reel 1).** Closed pink curtains with a red **SK** wax seal. Tap "Open the invitation" and the curtains part and tie back with gold tassels, birds fly off, and Sakshi & Kevin appear from behind on the palace terrace under a "You are invited" frame.
- **Scroll.** The painted scene softly blurs and the 3D card rises up from below.
- **3D booklet.** Each scroll flips the current page up and over to reveal the next one:
  1. Cover: S & K monogram in gold foil
  2. The wedding of Sakshi with Kevin
  3. Scratch to make a match (reveals S ♥ K)
  4. Four golden hearts to scratch
  5. One page each for Haldi, Mehendi and Wedding, with time, place and dress-code swatches
  6. Venue, with an "Open live location" button
  7. Gallery (shown only if photos are added)
  8. Thank you
- **On screen.** A page rail on the right, a page counter at the bottom, falling petals, and a gentle tilt that follows the mouse on desktop.

**The wedding date is deliberately not shown anywhere.**

## Paintings

The opening scene and the four event pictures are paintings you make with ChatGPT or Gemini.
Copy the prompts from [`ART_PROMPTS.md`](ART_PROMPTS.md) and save the results in `public/art/` as
`cover.webp`, `haldi.webp`, `mehendi.webp` and `wedding.webp` (already added). Until a file is there, a simple stand-in is shown.

## Edit the details

All text lives in [`src/invite/config.ts`](src/invite/config.ts). Lines marked ✏️ are placeholders:
- parents' names
- event times and places
- venue name and map search text
- optional photos: put them in `public/photos/` and list them in `PHOTOS`
- optional music: put a file at `public/music.mp3` and set `MUSIC`

Add `?open` to the URL to skip straight to the card.

## Run

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.
