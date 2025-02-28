import express from "express";
import { generateStep } from "./camera-route";
import { createDefectivePath, getAllDefectivePaths } from "./defectivePaths";
import {
  createDefectiveProduct,
  getAllDefectiveProducts,
<<<<<<< HEAD
} from "./defectiveProducts-routes";
import { createPath, deletePathRoute, getAllPaths } from "./paths-routes";
import { createProduct, deleteProduct, getAllProducts } from "./products-routes";
import { createTray, deleteTray, getAllTrays } from "./trays-routes";
import { createUser, getAllUsers, deleteUser } from "./users-routes";
=======
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
>>>>>>> 53c6ab86f82c85185b8976e9776173dbafbffdd6
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
<<<<<<< HEAD
routes.delete("/users", deleteUser);
=======
// login route
routes.post("/login", login);
//sector routes
routes.get("/sectors", getAllsectors);
routes.post("/sectors", createSector);
routes.patch("/sectors/:name", updateSector);
routes.delete("/sectors/:name", deleteSector);
>>>>>>> 53c6ab86f82c85185b8976e9776173dbafbffdd6
// workstations routes
routes.get("/workstations", getAllWorkstations);
routes.post("/workstations", createWorkStation);
routes.delete("/workstations/:id", deleteWorkstation);
routes.patch("/workstations/:id", updateWorkstation);
// trays routes
routes.get("/trays", getAllTrays);
routes.post("/trays", createTray);
routes.delete("/trays", deleteTray)
// products routes
routes.get("/products", getAllProducts);
routes.post("/products", createProduct);
routes.delete("/products", deleteProduct);
// paths routes
routes.get("/paths", getAllPaths);
<<<<<<< HEAD
routes.post("/paths", createPath);
routes.delete("/paths", deletePathRoute);
=======
// camera routes
routes.post("/camera", generateStep);
>>>>>>> 53c6ab86f82c85185b8976e9776173dbafbffdd6
// defective products routes
routes.get("/defective-products", getAllDefectiveProducts);
routes.post("/defective-products", createDefectiveProduct);
// defective paths routes
routes.get("/defective-paths", getAllDefectivePaths);
routes.post("/defective-paths", createDefectivePath);

export { routes };
