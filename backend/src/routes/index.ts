import express from "express";
import { getAllUsers } from "./get-all-users";

const routes = express.Router();

routes.get("/users", getAllUsers);

export { routes };
