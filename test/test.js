const express = require("express");
const stats = require("../index");

const app = express();

stats.init("password");
app.use("/stats", stats.router);
app.use(stats.middleware);

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.listen(5000, () => {
  console.log("Listening");
});
