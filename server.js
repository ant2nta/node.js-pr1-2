var express = require("express");
var path = require("path"); // модуль для парсинга шляху
var app = express();
var log = require("./libs/log")(module);

app.use(express.favicon()); // отдаем стандартную фавиконку, можем здесь же свою задать
app.use(express.logger("dev")); // выводим все запросы со статусами в консоль
app.use(express.bodyParser()); // стандартный модуль, для парсинга JSON в запросах
app.use(express.methodOverride()); // поддержка put и delete
app.use(app.router); // модуль для простого задания обработчиков путей
app.use(express.static(path.join(__dirname, "public"))); // запуск статического файлового сервера, который смотрит на папку public/ (в нашем случае отдает index.html)
app.get("/api", function (req, res) {
  res.send("API is running");
});

app.listen(1337, function () {
  log.info("Express server listening on port 1337");
});

app.use(function (req, res, next) {
  res.status(404);
  log.debug("Not found URL: %s", req.url);
  res.send({ error: "Not found" });
  return;
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  log.error("Internal error(%d): %s", res.statusCode, err.message);
  res.send({ error: err.message });
  return;
});

app.get("/ErrorExample", function (req, res, next) {
  next(new Error("Random error!"));
});

app.get("/api/articles", function (req, res) {
  res.send("This is not implemented now");
});

app.post("/api/articles", function (req, res) {
  res.send("This is not implemented now");
});

app.get("/api/articles/:id", function (req, res) {
  res.send("This is not implemented now");
});

app.put("/api/articles/:id", function (req, res) {
  res.send("This is not implemented now");
});

app.delete("/api/articles/:id", function (req, res) {
  res.send("This is not implemented now");
});
