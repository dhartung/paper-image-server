import express, { Application } from "express";
import "dotenv/config";
import { getNextImage } from "./image-selector";
import { createMessage, readImageAsBuffer } from "./message-writer";
import "express-async-errors"

const PORT = process.env.PAPER_PORT || 3000;
const IMAGE_DIRECTORY = process.env.PAPER_IMAGE_DIRECTORY || "./images";
const SLEEP_TIME_IN_SECONDS = process.env.PAPER_SLEEP_TIME_IN_SECONDS || 60_000;
const BASE_PATH = process.env.PAPER_BASE_PATH || "/";

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

const toInt = (value: any): number => {
  const num = toNumber(value);
  if (!Number.isInteger(num)) {
    throw Error(`Cannot convert ${value} to integer`);
  }
  return num;
};

base.get("/", async (req, res) => {
  const { version, voltage, wakups } = req.query;
  console.log(
    `Got request with version: ${version}, voltage: ${voltage}, wakups: ${wakups}`
  );

  const fileName = await getNextImage(IMAGE_DIRECTORY, toInt(version || 0));
  const image = await readImageAsBuffer(fileName.fileName);
  const response = await createMessage(image, fileName.id, toInt(SLEEP_TIME_IN_SECONDS));

  res.setHeader("Content-Type", "application/octet-stream");
  res.send(response);
});

app.use(BASE_PATH, base);

if (BASE_PATH != "/") {
    app.get("/", (_, res) => res.redirect(301, BASE_PATH))
}


app.listen(toInt(PORT), () => console.log("Server Running on Port " + PORT + " and path " + BASE_PATH));
