"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3_1 = require("sqlite3");
var db = new sqlite3_1.default.Database("./api_db.db");
var express = require("express");
function err_cb(err) {
    if (err)
        console.log(err);
}
var getRoute = function (req) {
    var route = req.route ? req.route.path : ""; // check if the handler exist
    var baseUrl = req.baseUrl ? req.baseUrl : ""; // adding the base url if the handler is a child of another handler
    return route ? "" + (baseUrl === "/" ? "" : baseUrl) + route : "unknown route";
};
function default_1(pass, opt) {
    var _this = this;
    if (!pass || pass.length < 1)
        throw new Error("Passowrd is required");
    var pwd = pass;
    db.serialize(function () {
        if (opt.freshDB)
            db.run("DROP TABLE IF EXISTS api_db", err_cb);
        db.run("CREATE TABLE IF NOT EXISTS api_db (\n      type TEXT NOT NULL,\n      route TEXT NOT NULL,\n      status INTEGER NOT NULL,\n      count INTEGER NOT NULL,\n      PRIMARY KEY(type, route, status)\n    )", err_cb);
    });
    var router = express.Router();
    router.use(express.json());
    var getDataAsJSON = function () {
        return new Promise(function (resolve, reject) {
            db.all("SELECT * FROM api_db", function (err, rows) {
                if (err)
                    reject(err);
                resolve(rows);
            });
        });
    };
    router.post("/", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (pwd.length < 1)
                        res.status(500).send("Initialization not done properly");
                    if (!(req.body.pwd && req.body.pwd === pwd)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getDataAsJSON()];
                case 1:
                    ret = _a.sent();
                    res.json(ret);
                    return [3 /*break*/, 3];
                case 2:
                    res.sendStatus(403);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    var middleware = function (req, res, next) {
        res.on("finish", function () {
            console.log(req.method + " " + getRoute(req) + " " + res.statusCode);
            db.serialize(function () {
                db.run("INSERT INTO api_db VALUES ($type, $route, $status, 1) ON CONFLICT(type, route, status)\n            DO UPDATE SET count = count + 1", { $type: req.method, $route: getRoute(req), $status: res.statusCode }, err_cb);
                db.each("SELECT * FROM api_db", function (err, row) {
                    if (err)
                        console.log(err);
                    console.log(row);
                });
            });
        });
        next();
    };
    return { middleware: middleware, router: router, getDataAsJSON: getDataAsJSON };
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map