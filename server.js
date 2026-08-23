// Static file server for the `next build` static export (next.config.ts sets
// output: "export" — there is no Next.js server to attach to in this mode,
// so we can't use the createServer()/getRequestHandler() custom-server
// pattern. This serves the exported `out/` folder the same way Apache does
// in production, just on localhost:4000 for local testing.
const { createServer } = require("http");
const { existsSync, statSync, createReadStream } = require("fs");
const { extname, join, normalize } = require("path");

const PORT = process.env.PORT || 4000;
const OUT_DIR = join(__dirname, "out");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const safePath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  let filePath = join(OUT_DIR, safePath);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  // next.config.ts sets trailingSlash: true, so routes are exported as
  // `/foo/index.html`. Fall back to `<path>.html` for any that aren't.
  if (!existsSync(filePath) && !extname(filePath)) {
    const withHtml = `${filePath}.html`;
    if (existsSync(withHtml)) filePath = withHtml;
  }

  return filePath;
}

const server = createServer((req, res) => {
  const filePath = resolvePath(req.url || "/");

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    const notFoundPath = join(OUT_DIR, "404.html");
    if (existsSync(notFoundPath)) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      createReadStream(notFoundPath).pipe(res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
    }
    return;
  }

  const contentType = MIME_TYPES[extname(filePath)] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": contentType });
  createReadStream(filePath).pipe(res);
});

if (!existsSync(OUT_DIR)) {
  console.error(
    `> No "out/" directory found. Run "npm run build" first to generate the static export, then re-run "node server.js".`
  );
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`> Serving out/ at http://localhost:${PORT}`);
});
