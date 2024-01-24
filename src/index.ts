import express  from "express";
import "dotenv/config";
import { createMessage, generateDisplayImage } from "./message-writer";
import "express-async-errors";
import getEventsForRoom from "./data-provider";
import getNextWakeupSeconds from "./wakeup-calculator";
import database from "./database/database";


const PORT = process.env.PAPER_PORT || 3000;
const BASE_PATH = process.env.PAPER_BASE_PATH || "/";

const app = express();
const base = express();

console.log(database.getRoom(1));


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
    const { version, voltage, wakeups, key: secret } = req.query;
    console.log(`Got request with parameter: ${JSON.stringify(req.query)}`);

    const room = database.getRoomBySecret(secret as string);
    if (room) {
      database.createVoltage(room.id, toNumber(voltage), toNumber(wakeups));
    }

    const events = getEventsForRoom(1);

    const wakeUpTime = getNextWakeupSeconds(events[0].time_end);
    console.log(`Wake next Wakeup of >>>${secret}<<< in ${wakeUpTime} seconds`)

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
