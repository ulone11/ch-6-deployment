var express = require("express");
const Sentry = require("@sentry/node");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("./instrument");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var postRouter = require("./routes/post");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

Sentry.setupExpressErrorHandler(app);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/post", postRouter);

module.exports = app;
