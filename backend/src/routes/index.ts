import express from "express";
import { getAllUsers } from "./get-all-users";
import { getAllWorkstations } from "./get-all-workstations";
import { getAllDefectiveProducts } from "./get-all-defectiveProducts";
import { getAllProducts } from "./get-all-products";

const routes = express.Router();

routes.get("/users", getAllUsers);
routes.get("/workStations", getAllWorkstations);
routes.get("/defectiveProducts", getAllDefectiveProducts);
routes.get("/products", getAllProducts);

export { routes };
