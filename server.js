// server.js
const jsonServer = require("json-server");
const path = require("path");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Middleware: sinh ID dạng số nếu thiếu
server.use((req, res, next) => {
  if (req.method === "POST" && !req.body.id) {
    req.body.id = Date.now();
  }
  next();
});

server.use(router);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ JSON Server đang chạy tại http://localhost:${PORT}`);
});
