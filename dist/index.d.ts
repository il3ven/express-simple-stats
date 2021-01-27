import * as express from "express";
export interface ExpressStats {
    middleware: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
    router: express.Router;
    getDataAsJSON: () => Promise<unknown>;
}
export default function (pass: String, opt?: {
    freshDB: Boolean;
}): ExpressStats;
