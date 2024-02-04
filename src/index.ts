import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import api from "./database/api";
import config from "./config";
import { getResponseForRoom } from "./service/glue-service";
import { HttpError } from "./errors";

const app = express();
const base = express();

const toNumber = (value: any): number => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return Number(value);
  } else {
    throw Error(`Cannot convert ${value} to number`);
  }
};

base.get("/", async (req, res) => {
  const { version, voltage, wakeups, key, emulator } = req.query;
  console.log(`Got request with parameter: ${JSON.stringify(req.query)}`);

  // const room = database.getRoomBySecret(secret as string);
  const response = await getResponseForRoom(key as string);

  // if (!emulator && room) {
  //   database.createVoltage(room.id, toNumber(voltage), toNumber(wakeups));
  // }

  res.setHeader("Content-Type", "application/octet-stream");
  res.send(response);
});

app.use(config.basePath, base);
// app.use("/", express.static(path.join(__dirname, "..", "interface", "dist")));
app.use("/api", api);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).send(err.message);
  } else {
    console.error(err);
    res.status(500).send("Internal server error:" + err.message);
  }
});

if (config.basePath != "/") {
  app.get("/", (_, res) => res.redirect(301, config.basePath));
}

app.listen(toNumber(config.port), () =>
  console.log(
    "Server Running on Port " + config.port + " and path " + config.basePath
  )
);
