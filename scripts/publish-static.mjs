import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
const html = await readFile(join(output, "index.html"), "utf8");

if (!html.includes("./assets/") || /src=["'][^"']*\.jsx/.test(html)) {
  throw new Error(
    "Refusing to publish an uncompiled or nonportable Pages entry.",
  );
}

// These root files are generated deployment output. Source files stay in src/.
await rm(join(root, "assets"), { recursive: true, force: true });
await mkdir(join(root, "assets"), { recursive: true });
await cp(join(output, "assets"), join(root, "assets"), { recursive: true });
for (const name of ["index.html", "favicon.svg", ".nojekyll"]) {
  await cp(join(output, name), join(root, name));
}
console.log(
  "Published compiled entry and assets to the repository root for GitHub Pages.",
);
