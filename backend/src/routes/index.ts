import express from "express";
import { createPath } from "./camera-route";
import {
  createDefectivePath,
  getAllDefectivePaths,
} from "./defectivePathEndpoint";
import {
  createDefectiveProduct,
  getAllDefectiveProducts,

} from "./defectiveProducts";
import { login } from "./login";
import { getAllPaths } from "./paths";
import { createProduct, getAllProducts } from "./products";
import {
  createSector,
  deleteSector,
  getAllsectors,
  updateSector,
} from "./sectors";
import { createTray, getAllTrays } from "./trays";
import { createUser, getAllUsers } from "./users";
import {
  createWorkStation,
  deleteWorkstation,
  getAllWorkstations,
  updateWorkstation,
} from "./workstations";

const routes = express.Router();
// user routes
routes.get("/users", getAllUsers);
routes.post("/users", createUser);
// login route
routes.post("/login", login);
//sector routes
routes.get("/sectors", getAllsectors);
routes.post("/sectors", createSector);
routes.patch("/sectors/:name", updateSector);
routes.delete("/sectors/:name", deleteSector);
// workstations routes
routes.get("/workstations", getAllWorkstations);
routes.post("/workstations", createWorkStation);
routes.delete("/workstations/:id", deleteWorkstation);
routes.patch("/workstations/:id", updateWorkstation);
// trays routes
routes.get("/trays", getAllTrays);
routes.post("/trays", createTray);
// products routes
routes.get("/products", getAllProducts);
routes.post("/products", createProduct);
// paths routes
routes.get("/paths", getAllPaths);
// camera routes
// defective products routes
routes.get("/defective-products", getAllDefectiveProducts);
routes.post("/defective-products", createDefectiveProduct);
// camera routes (NEW)
routes.post("/camera/path", createPath);
routes.post("/camera/defective-path", createDefectivePath);
routes.get("/paths", getAllPaths);
routes.get("/defective-paths", getAllDefectivePaths);
export { routes };
