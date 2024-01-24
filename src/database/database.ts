import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(__dirname, "database.db"), { verbose: console.log, fileMustExist: true });

function createRoom(name: string, type: string, url: string, secret: string) {
    const stmt = db.prepare("INSERT INTO Rooms (name, type, url, secret) VALUES ($name, $type, $url, $secret)");
    return stmt.run({ name, type, url, secret });
    
}
function createVoltage(room_id: number,voltage: number, wakeups: number) {
    const created_at = (new Date()).toISOString();

    const stmt = db.prepare("INSERT INTO Voltages (room_id, created_at, voltage, wakeups) VALUES ($room_id, $created_at, $voltage, $wakeups)");
    return stmt.run({ room_id, created_at, voltage, wakeups });
}
function getRoom(id: number) : Room  | undefined{
    const stmt = db.prepare("SELECT * FROM Rooms WHERE id = $id");
    return stmt.get({ id }) as Room;
}
function getRooms() {
    const stmt = db.prepare("SELECT * FROM Rooms");
    return stmt.all();
}
function getRoomBySecret(secret: string) : Room | undefined{
    const stmt = db.prepare("SELECT * FROM Rooms WHERE secret = $secret");
    return stmt.get({ secret }) as Room;
}
function getVoltagesForRoom(room_id: number) {
    const stmt = db.prepare("SELECT * FROM Voltages WHERE room_id = $room_id");
    return stmt.all({ room_id });
}
function deleteRoom(id: number) {
    deleteVoltagesForRoom(id);
    const stmt = db.prepare("DELETE FROM Rooms WHERE id = $id");
    return stmt.run({ id });
}
function deleteVoltagesForRoom(room_id: number) {
    const stmt = db.prepare("DELETE FROM Voltages WHERE room_id = $room_id");
    return stmt.run({ room_id });
}

type Room = {
    id: number,
    name: string,
    type: string,
    url: string,
    secret: string
}


export default {
    getRooms,
    getRoomBySecret,
    createRoom,
    createVoltage,
    getRoom,
    getVoltagesForRoom,
    deleteRoom,
    deleteVoltagesForRoom
}