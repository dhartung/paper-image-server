import express, { Application } from "express";
import "dotenv/config";
import { createMessage, generateDisplayImage } from "./message-writer";
import "express-async-errors";
import getEventsForRoom from "./data-provider";
import getNextWakeupSeconds from "./wakeup-calculator";

const PORT = process.env.PAPER_PORT || 3000;
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

    const events = getEventsForRoom(1);

    const wakeUpTime = getNextWakeupSeconds(events[0].time_end);
    console.log(`Wake next Wakeup of "${key}" in ${wakeUpTime} seconds`)

    const image = await generateDisplayImage(
      "http://test.url.com",
      "title",
      "subtitle",
      events
    );
    const response = await createMessage(
      image,
      0,
      wakeUpTime
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
