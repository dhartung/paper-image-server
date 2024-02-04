import { parse } from "yaml"
import { readFileSync } from "fs";

const configFileName = process.env.ROOMS_CONFIGURATION_FILE  || './rooms.yaml';
const configString = readFileSync(configFileName, "utf-8");

export type RoomsConfig = {
    name: string,
    key: string,
    type: string,
    url: string
}

export const rooms: RoomsConfig[] = parse(configString).rooms as RoomsConfig[];

export const getRoomByKey = (key: String) => {
    return rooms.find(room => room.key === key);
}