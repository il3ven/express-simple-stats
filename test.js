const app = require("express")();
const analytics = require("./index");

app.get("/stats", async (req, res) => {
  const ret = await analytics.getDataAsJSON();

  res.json(ret);
})

app.use(analytics.middleware);

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.listen(5000);