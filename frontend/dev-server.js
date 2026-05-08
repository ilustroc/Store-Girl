const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.argv[2] || 5500);
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

http.createServer((request, response) => {
    const urlPath = decodeURIComponent(request.url.split("?")[0]);
    const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
    let filePath = path.join(root, safePath === "/" ? "index.html" : safePath);

    if (!filePath.startsWith(root)) {
        response.writeHead(403);
        response.end("Forbidden");
        return;
    }

    fs.stat(filePath, (statError, stat) => {
        if (statError || !stat.isFile()) {
            filePath = path.join(root, "index.html");
        }
        fs.readFile(filePath, (readError, content) => {
            if (readError) {
                response.writeHead(500);
                response.end("Server error");
                return;
            }
            response.writeHead(200, {
                "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
            });
            response.end(content);
        });
    });
}).listen(port, () => {
    console.log(`Frontend disponible en http://localhost:${port}`);
});
