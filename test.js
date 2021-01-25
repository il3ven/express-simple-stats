const app = require("express")();
const analytics = require("./index");

app.use(analytics);

app.get("/", (req, res) => {
  res.send("Hello world");
})

app.listen(5000);