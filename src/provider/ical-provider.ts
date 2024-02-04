import { parseICS, VEvent } from "node-ical";
import { MeetingEvent } from "../types";

const isVEvent = (event: any): event is VEvent => {
  return event.type === "VEVENT";
};

export const getAuthorFromEmail = (email: string): string | undefined => {
  const dotIndex = email.indexOf(".");
  const atIndex = email.indexOf("@");
  if (dotIndex === -1 || dotIndex >= atIndex) {
    return undefined;
  }

  const surnameLowercase = email.substring(0, dotIndex);
  const surname =
    surnameLowercase.substring(0, 1).toUpperCase() +
    surnameLowercase.substring(1);
  const lastName = email.substring(dotIndex + 1, dotIndex + 2).toUpperCase();

  return `${surname} ${lastName}`;
};

export const getAuthorAndTitle = (
  event: Pick<VEvent, "summary" | "attendee">
): { title: string; author?: string } => {
  // We often have the name of the author attached to the title of the event
  if (event.summary.endsWith(")")) {
    var n = event.summary.lastIndexOf("(");
    return {
      title: event.summary.substring(0, n).trim(),
      author: event.summary.substring(n + 1, event.summary.length - 1),
    };
  } else if (event.summary.startsWith("(")) {
    var n = event.summary.indexOf(")");
    return {
      title: event.summary.substring(n + 1).trim(),
      author: event.summary.substring(1, n),
    };
  }

  // Try to extract the name - it often is the first attendee
  const attendee = Array.isArray(event.attendee)
    ? event.attendee[0]
    : event.attendee;
  const email = typeof attendee == "string" ? attendee : attendee?.params.CN;

  return {
    title: event.summary,
    author: email && getAuthorFromEmail(email),
  };
};

export const getEventsFromIcal = (ics: string): MeetingEvent[] => {
  const parsed = parseICS(ics);
  const events = Object.values(parsed);
  return events
    .filter((x) => isVEvent(x))
    .map((event) => event as VEvent)
    .map((event) => {
      const { title, author } = getAuthorAndTitle(event);
      return {
        rooms: event.location.split(",").map((x) => x.trim()),
        start: event.start,
        end: event.end,
        title: title,
        author: author,
        description: event.description,
      };
    });
};
