import {
  getAuthorFromEmail,
  getAuthorAndTitle,
  getEventsFromIcal,
} from "./ical-provider";
import { readFile } from "fs/promises";

describe("getAuthorFromEmail", () => {
  it("should return shortend name for a valid email", () => {
    const email = "john.doe@example.com";
    const expected = "John D";
    expect(getAuthorFromEmail(email)).toEqual(expected);
  });

  it("should return undefined for an email without a dot seperation", () => {
    const email = "johndoe@example.com";
    const expected = undefined;
    expect(getAuthorFromEmail(email)).toEqual(expected);
  });

  it("should return undefined for an empty email", () => {
    const email = "";
    const expected = undefined;
    expect(getAuthorFromEmail(email)).toEqual(expected);
  });
});

describe("getAuthorAndTitle", () => {
  it("should extract author and title from summary with parentheses", () => {
    const event = {
      summary: "The Catcher in the Rye (J.D. Salinger)",
    };

    const expected = {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
    };

    expect(getAuthorAndTitle(event)).toEqual(expected);
  });

  it("should extract author and title from summary with parentheses at the beginning", () => {
    const event = {
      summary: "(J.D. Salinger) The Catcher in the Rye",
    };

    const expected = {
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
    };

    expect(getAuthorAndTitle(event)).toEqual(expected);
  });

  it("should extract auhtor only when the string begins or ends with it", () => {
    const event = {
      summary: "The Catcher (J.D. Salinger) in the Rye",
    };

    const expected = {
      title: "The Catcher (J.D. Salinger) in the Rye",
      author: undefined,
    };

    expect(getAuthorAndTitle(event)).toEqual(expected);
  });

  it("should extract author from email address for different event types", () => {
    const event0 = {
      summary: "The Great Gatsby",
      attendee: "frank.scott@example.com",
    };

    const event1 = {
      ...event0,
      attendee: {
        val: "Attendee",
        params: {
          CN: event0.attendee,
        },
      },
    };

    const event2 = {
      ...event0,
      attendee: [
        {
          val: "Attendee",
          params: {
            CN: event0.attendee,
          },
        },
        {
          val: "Attendee",
          params: {
            CN: "john.doe@example.com",
          },
        },
      ],
    };

    const expected = {
      title: "The Great Gatsby",
      author: "Frank S",
    };

    expect(getAuthorAndTitle(event0)).toEqual(expected);
    expect(getAuthorAndTitle(event1)).toEqual(expected);
    expect(getAuthorAndTitle(event2)).toEqual(expected);
  });
});

describe("getEventsFromIcal", () => {
  it("should extract author and title from summary with parentheses", async () => {
    const ical = await readFile("./test/basic.ics");
    const events = getEventsFromIcal(ical.toString());

    const expected = {
      rooms: [
        "Frankfurt-1 (1)",
        "Frankfurt-1 (2)",
      ],
      start: new Date("2024-02-05T07:00:00.000Z"),
      end: new Date("2024-02-05T08:00:00.000Z"),
      title: "Blocker: Workshop: Pommes Mayo",
      description: undefined,
      author: "John S",
    };

    expect(events[0]).toEqual(expected);
  });
});
