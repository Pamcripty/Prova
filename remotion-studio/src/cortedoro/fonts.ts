import { continueRender, delayRender, staticFile } from "remotion";

const faces = [
  { family: "Playfair Display", file: "playfair-display-latin-400-italic.woff2", style: "italic", weight: "400" },
  { family: "Playfair Display", file: "playfair-display-latin-700-normal.woff2", style: "normal", weight: "700" },
  { family: "EB Garamond", file: "eb-garamond-latin-400-normal.woff2", style: "normal", weight: "400" },
  { family: "EB Garamond", file: "eb-garamond-latin-500-normal.woff2", style: "normal", weight: "500" },
];

// Blocks rendering until every font is loaded, so no frame falls back to a system font.
const handle = delayRender("Loading Cortedoro fonts");
Promise.all(
  faces.map((f) =>
    new FontFace(f.family, `url(${staticFile(`fonts/${f.file}`)}) format("woff2")`, {
      style: f.style,
      weight: f.weight,
    })
      .load()
      .then((face) => document.fonts.add(face)),
  ),
).then(() => continueRender(handle));
