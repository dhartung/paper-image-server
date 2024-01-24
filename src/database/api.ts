import { Router } from "express";
import database from "./database";


const api = Router();
api.get("/", (_, res) => res.send("Hello World!"));
api.get("/rooms", (_, res) => res.send(database.getRooms()));
api.get("/voltages/:id", (req, res) => res.send(database.getVoltagesForRoom(Number(req.params.id))));



export default api;