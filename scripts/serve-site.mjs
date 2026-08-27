import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("site");
const port = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8" };

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  let target = path.join(root, pathname);
  if (pathname.endsWith("/")) target = path.join(target, "index.html");
  if (!path.extname(target)) target = path.join(target, "index.html");
  if (!target.startsWith(root) || !fs.existsSync(target)) target = path.join(root, "404.html");
  response.writeHead(target.endsWith("404.html") ? 404 : 200, { "Content-Type": types[path.extname(target)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(target).pipe(response);
});

server.listen(port, "127.0.0.1", () => console.log(`Preview: http://127.0.0.1:${port}/`));
