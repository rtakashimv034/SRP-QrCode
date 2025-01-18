import express from "express";
import { createPath } from "./create-path";
import { createProduct } from "./create-product";
import { createWorkStation } from "./create-workStation";
import { getAllDefectivePaths } from "./get-all-defectivePaths";
import { getAllPaths } from "./get-all-paths";
import { getAllTrays } from "./get-all-trays";
import { getAllUsers } from "./get-all-users";

const routes = express.Router();

routes.get("/users", getAllUsers);
routes.get("/trays", getAllTrays);
routes.get("/paths", getAllPaths);
routes.post("/paths", createPath);
routes.post("/products", createProduct);
routes.post("/workStations", createWorkStation);
routes.get("/defective-paths", getAllDefectivePaths);

export { routes };
