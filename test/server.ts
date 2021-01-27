import * as express from "express";
import Stats from "../dist/index";

const stats = Stats("password");

const app = express();

app.use("/stats", stats.router);
app.use(stats.middleware);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(5000, () => {
  console.log("Listening");
});
