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

//API get course category
server.get("/courses/:categorySlug", (req, res) => {
  const { categorySlug } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;

  const db = router.db;

  const allCourses = db
    .get("courses")
    .filter((course) => course.category?.slug === categorySlug)
    .value();

  const total = allCourses.length;
  const start = (page - 1) * limit;
  const end = page * limit;

  const data = allCourses.slice(start, end);

  res.json({
    data,
    pagination: {
      page,
      limit,
      total,
    },
  });
});

//API get course category detail
server.get("/courses/:categorySlug/:courseId", (req, res) => {
  const { categorySlug, courseId } = req.params;
  const db = router.db;

  const course = db
    .get("courses")
    .find(
      (item) => item.id === courseId && item.category?.slug === categorySlug,
    )
    .value();

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  res.json(course);
});

server.use(router);

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`✅ JSON Server đang chạy tại http://localhost:${PORT}`);
});
