export type MeetingEvent = {
    rooms: string[];
    start: Date;
    end: Date;
    title: string;
    description: string;
    author?: string;
  };  