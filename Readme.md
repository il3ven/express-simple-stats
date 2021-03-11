# Express Simple Stats

Easily count requests coming to your API routes.

## How does it work?

The middleware maintains a sqlite database in the file system where the following data is stored.

| Type |    Route    | Status | Count |
|:----:|:-----------:|--------|-------|
|  GET |      /      | 200    | 502   |
| POST | /api/signup | 200    | 117   |
|  GET |  /blog/:id  | 200    | 400   |

## Usage
```ts
import * as express from "express";
const app = express();

import { Stats } from "express-simple-stats";

/* A passowrd is provided while intializing the library. 
 * It will be used to authenticate request to get data.
 */
const stats = Stats("123456789");

/* POST request to get data will be made at this endpoint. */
app.use("/stats", stats.router);

/* All the routes created before adding this
 * middleware will not be counted.
 */
app.use(stats.middleware);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(5000, () => {
  console.log("Listening");
});
```

## How to view the data?

#### 1. POST request to an exposed endpoint
For example, in the above code `/stats` is exposed as an endpoint. A POST request to this endpoint with the correct password will return the stats as JSON.

##### Request

```bash
curl --location --request POST 'http://localhost:5000/stats/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "pwd": "123456789"
}'
```

##### Sample Response
```json
[
    {
        "type": "GET",
        "route": "/",
        "status": 200,
        "count": 2
    },
    {
        "type": "GET",
        "route": "unknown route",
        "status": 404,
        "count": 2
    },
    {
        "type": "GET",
        "route": "/",
        "status": 304,
        "count": 1
    }
]
```

##### Note:

1. The endpoint to view the data is configurable.
1. The password is set while intializing the library.

#### 2. Log the data

```js
(async function() {
  const data = await stats.getDataAsJSON();
  console.log(data);
})();
```
