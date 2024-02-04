import { getEventsFromIcal, requestIcal } from "../provider";
import { getRoomByKey } from "../database";
import { render } from "../image-geneator/render";
import { MeetingEvent } from "../types";
import { createMessage, generateDisplayImage } from "./message-writer";
import { getSleepTimeInSeconds } from "./wakeup-calculator";
import config from "../config";
import { Unauthorized } from "../errors";

/**
 * As google stores a lot of additional information for each room, we are
 * more than happy if we find the (unique) name of the room somewhere
 * in the room array.
 */
const roomOfEventContainsName = (event: MeetingEvent, roomName: String) =>
  event.rooms.find((eventRoom) =>
    eventRoom.toLowerCase().includes(roomName.toLowerCase())
  );

export const getResponseForRoom = async (key: string): Promise<Buffer> => {
  const ical = await requestIcal();
  const events = await getEventsFromIcal(ical);
  const room = getRoomByKey(key);

  if (!room) {
    throw new Unauthorized("The provided key is not registered");
  }

  const eventsForRoom = events.filter((event) => roomOfEventContainsName(event, room.name));
  const image = await render(
    room.url,
    room.name,
    room.type,
    eventsForRoom
  )

  const displayImage = await generateDisplayImage(image)
  const sleepTime = getSleepTimeInSeconds(config.updateCron)
  
  return createMessage(
    displayImage,
    1,
    sleepTime
  )
};
