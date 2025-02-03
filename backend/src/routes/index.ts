import express from "express";
import {
  createDefectivePath,
  getAllDefectivePaths,
} from "./defectivePaths-routes";
import {
  createDefectiveProduct,
  getAllDefectiveProducts,
} from "./defectiveProducts-routes";
import { createPath, getAllPaths } from "./paths-routes";
import { createProduct, getAllProducts } from "./products-routes";
import { createTray, getAllTrays } from "./trays-routes";
import { createUser, getAllUsers } from "./users-routes";
import {
  createWorkStation,
  deleteWorkstation,
  getAllWorkstations,
  updateWorkstation,
} from "./workstations-routes";

const routes = express.Router();
// user routes
routes.get("/users", getAllUsers);
routes.post("/users", createUser)
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
routes.post("/paths", createPath);
// defective products routes
routes.get("/defective-products", getAllDefectiveProducts);
routes.post("/defective-products", createDefectiveProduct);

// defective paths routes
routes.get("/defective-paths", getAllDefectivePaths);
routes.post("/defective-paths", createDefectivePath);

export { routes };
