import fs from 'fs';
import { join as pathJoin } from "path";


function getEventsForRoom(roomID: number) {
        let roomEvents = getAllEvents().filter(event => event.room === roomID);
        roomEvents = roomEvents.filter(event => event.time_end.getTime() - (new Date()).getTime() > 0); // Filter events where the end time is in the future
        return roomEvents.sort((a, b) => a.time_start.toString().localeCompare(b.time_start.toString()));
}


function getAllEvents() : Event[] {
        const raw : string = fs.readFileSync(pathJoin(__dirname, 'data.json'), 'utf8');
        const data = JSON.parse(raw);

        data.forEach((event: any) => {
                event.time_start = new Date(event.time_start);
                event.time_end = new Date(event.time_end);
        });

        return data;
}


type Event = {
    title: string;
    time_start: Date;
    time_end: Date;
    person: string;
    room: number;
};

export default getEventsForRoom;
