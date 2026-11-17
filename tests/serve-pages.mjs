// Model GitHub Pages: serve committed files under a repository prefix, with no
// JSX transformation or SPA fallback that could conceal broken asset paths.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, sep } from "node:path";

const root = resolve(fileURLToPath(new URL("../", import.meta.url)));
const prefix = "/Research-Portfolio/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer(async (request, response) => {
  const pathname = new URL(request.url, "http://localhost").pathname;
  const relative = pathname.slice(prefix.length) || "index.html";
  const file = resolve(root, relative);
  if (
    !pathname.startsWith(prefix) ||
    !file.startsWith(root + sep) ||
    !(
      relative === "index.html" ||
      relative === "favicon.svg" ||
      relative.startsWith("assets/")
    )
  ) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const body = await readFile(file);
    response
      .writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      })
      .end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(4174, "127.0.0.1", () => {
  console.log(
    "Serving committed Pages output at http://127.0.0.1:4174/Research-Portfolio/",
  );
});
