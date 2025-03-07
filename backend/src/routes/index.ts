import express from "express";
import { createDefectivePath, createPath } from "./camera-route";
import { getAllDefectivePaths } from "./defectivePaths";
import { getAllDefectiveProducts } from "./defectiveProducts";
import { login } from "./login";
import { getAllPaths } from "./paths";
import { getAllProducts } from "./products";
import {
  createSector,
  deleteSector,
  getAllsectors,
  getSectorByName,
  updateSector,
} from "./sectors";
import { createTray, deleteTray, getAllTrays } from "./trays";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "./users";
("");
const routes = express.Router();
// user routes
routes.get("/users", getAllUsers);
routes.get("/users/:id", getUserById);
routes.post("/users", createUser);
routes.delete("/users/:id", deleteUser);
routes.patch("/users/:id", updateUser);
// login route
routes.post("/login", login);
//sector routes
routes.get("/sectors", getAllsectors);
routes.get("/sectors/:name", getSectorByName);
routes.post("/sectors", createSector);
routes.patch("/sectors/:name", updateSector);
routes.delete("/sectors/:name", deleteSector);
// trays routes
routes.get("/trays", getAllTrays);
routes.post("/trays", createTray);
routes.post("/trays", deleteTray);
// products routes
routes.get("/products", getAllProducts);
// defective products routes
routes.get("/defective-products", getAllDefectiveProducts);
// all paths routes
routes.get("/paths", getAllPaths);
routes.get("/defective-paths", getAllDefectivePaths);
// camera routes (NEW)
routes.post("/camera/path", createPath);
routes.post("/camera/defective-path", createDefectivePath);
export { routes };
