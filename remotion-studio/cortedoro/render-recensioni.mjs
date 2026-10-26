// Renders one square video per review in recensioni.json into renders/recensioni/.
// Usage: npm run recensioni
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const reviews = JSON.parse(readFileSync(new URL("./recensioni.json", import.meta.url), "utf8"));

for (const { file, ...props } of reviews) {
  const out = `renders/recensioni/${file}.mp4`;
  console.log(`→ ${out}`);
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", "CortedoroRecensione", out, `--props=${JSON.stringify({ brand: "CORTEDORO", ...props })}`],
    { stdio: "inherit" },
  );
}
