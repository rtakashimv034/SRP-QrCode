import express from "express";
import { generateStep } from "./camera-route";
import { createDefectivePath, getAllDefectivePaths } from "./defectivePaths";
import {
  createDefectiveProduct,
  getAllDefectiveProducts,
} from "./defectiveProducts";
import { getAllPaths } from "./paths";
import { createProduct, getAllProducts } from "./products";
import { createTray, getAllTrays } from "./trays";
import { createUser, getAllUsers, login } from "./users";
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
routes.post("/users/login", login)
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
routes.post("/camera", generateStep);
// defective products routes
routes.get("/defective-products", getAllDefectiveProducts);
routes.post("/defective-products", createDefectiveProduct);

// defective paths routes
routes.get("/defective-paths", getAllDefectivePaths);
routes.post("/defective-paths", createDefectivePath);

export { routes };
