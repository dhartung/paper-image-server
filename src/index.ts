import express, { Application } from "express";
import "dotenv/config";
import { getNextImage } from "./image-selector";
import { createMessage, readImageAsBuffer } from "./message-writer";
import "express-async-errors";

const PORT = process.env.PAPER_PORT || 3000;
const IMAGE_DIRECTORY = process.env.PAPER_IMAGE_DIRECTORY || "./images";
const SLEEP_TIME_IN_SECONDS = process.env.PAPER_SLEEP_TIME_IN_SECONDS || 60_000;
const BASE_PATH = process.env.PAPER_BASE_PATH || "/";
const DEVICE_KEYS = process.env.PAPER_DEVICE_KEYS?.split(",") || [];

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

const checkDeviceKey = (key: string | undefined): void => {
  if (DEVICE_KEYS.length > 0) {
    if (!key || !DEVICE_KEYS.includes(key.toString())) {
      throw Error(`Invalid key`);
    }
  }
};

base.get("/", async (req, res) => {
  const { version, voltage, wakeups, key } = req.query;
  console.log(`Got request with parameter: ${JSON.stringify(req.query)}`);

  checkDeviceKey(key?.toString());

  const fileName = await getNextImage(IMAGE_DIRECTORY, toNumber(version || 0));
  const image = await readImageAsBuffer(fileName.fileName);
  const response = await createMessage(
    image,
    fileName.id,
    toNumber(SLEEP_TIME_IN_SECONDS)
  );

  res.setHeader("Content-Type", "application/octet-stream");
  res.send(response);
});

app.use(BASE_PATH, base);

if (BASE_PATH != "/") {
  app.get("/", (_, res) => res.redirect(301, BASE_PATH));
}

app.listen(toNumber(PORT), () =>
  console.log("Server Running on Port " + PORT + " and path " + BASE_PATH)
);
