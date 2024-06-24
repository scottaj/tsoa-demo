import express, {json, urlencoded} from "express";
require('express-async-errors') // Don't move this, needs to be before the router imports

import { RegisterRoutes } from "./routes";
import {WebServerError} from "./errors";
import {DemoRouter} from "./demo-controller";

export const app = express();
const router = express.Router();

// Use body parser to read sent json payloads
app.use( urlencoded({ extended: true, }) );
app.use(json());

router.use("v1/spells", DemoRouter)
RegisterRoutes(app);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof WebServerError && err.httpCode < 500) {
        console.info(`Client error in request ${req.url}`, err)
    } else {
        console.error(`Server error in request ${req.url}`, err)
    }

    if (err instanceof WebServerError) {
        res.status(err.httpCode).send({ message: err.message })
    } else {
        res.status(500).send({ message: 'Something went wrong' })
    }

    next(err)
})

const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`Example app listening at http://localhost:${port}`)
);