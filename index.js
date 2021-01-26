const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./api_db.db");

const express = require("express");

function err_cb(err) {
  if (err) console.log(err);
}

const getRoute = (req) => {
  const route = req.route ? req.route.path : ""; // check if the handler exist
  const baseUrl = req.baseUrl ? req.baseUrl : ""; // adding the base url if the handler is a child of another handler

  return route ? `${baseUrl === "/" ? "" : baseUrl}${route}` : "unknown route";
};

module.exports = (pass, opt = {}) => {
  if (!pass || pass.length < 1) throw new Error("Passowrd is required");

  let pwd = pass;

  db.serialize(() => {
    if (opt.freshDB) db.run("DROP TABLE IF EXISTS api_db", err_cb);

    db.run(
      `CREATE TABLE IF NOT EXISTS api_db (
      type TEXT NOT NULL,
      route TEXT NOT NULL,
      status INTEGER NOT NULL,
      count INTEGER NOT NULL,
      PRIMARY KEY(type, route, status)
    )`,
      err_cb
    );
  });

  const router = express.Router();
  router.use(express.json());

  const getDataAsJSON = () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM api_db`, (err, rows) => {
        if (err) reject("Error in fetching data from DB", err);

        resolve(rows);
      });
    });
  };

  router.post("/", async (req, res) => {
    if (pwd.length < 1)
      res.status(500).send("Initialization not done properly");

    if (req.body.pwd && req.body.pwd === pwd) {
      const ret = await getDataAsJSON();

      res.json(ret);
    } else {
      res.sendStatus(403);
    }
  });

  const middleware = (req, res, next) => {
    res.on("finish", () => {
      console.log(`${req.method} ${getRoute(req)} ${res.statusCode}`);

      db.serialize(() => {
        db.run(
          `INSERT INTO api_db VALUES ($type, $route, $status, 1) ON CONFLICT(type, route, status)
            DO UPDATE SET count = count + 1`,
          { $type: req.method, $route: getRoute(req), $status: res.statusCode },
          err_cb
        );

        db.each("SELECT * FROM api_db", (err, row) => {
          if (err) console.log(err);

          console.log(row);
        });
      });
    });

    next();
  };

  return { middleware, router, getDataAsJSON };
};
