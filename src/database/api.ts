import { Router, json } from "express";
import database from "./database";


const api = Router();

api.use(json());

api.get("/", (_, res) => res.send("Hello World!"));
api.get("/rooms", (_, res) => res.send(database.getRooms()));
api.get("/rooms/:id", (req, res) => res.send(database.getRoom(Number(req.params.id))));
api.get("/voltages/:id", (req, res) => res.send(database.getVoltagesForRoom(Number(req.params.id))));

api.delete("/rooms/:id", (req, res) => {
    database.deleteRoom(Number(req.params.id));
    res.send("OK");
});

api.post("/rooms", (req, res) => {
    const { name, url, type, secret } = req.body;
    database.createRoom(name, type, url, secret);
    res.send("OK");
});

export default api;