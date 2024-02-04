import { Router, json } from "express";

const api = Router();

api.use(json());
export default api;