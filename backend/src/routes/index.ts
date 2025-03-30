import express from "express";
import { upload } from "../lib/multer";
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from "../services/auth/retrivePassword";
import { createDefectivePath, createPath } from "./camera-route";
import { getAllDefectivePaths } from "./defectivePaths";
import {
  deleteAllDefectiveProducts,
  getAllDefectiveProducts,
} from "./defectiveProducts";
import { login } from "./login";
import { getAllPaths } from "./paths";
import { deleteAllProducts, getAllProducts } from "./products";
import {
  createSector,
  deleteSector,
  getAllsectors,
  getSectorByName,
  updateSector,
} from "./sectors";
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
routes.post("/users", upload.single("avatar"), createUser);
routes.patch("/users/:id", upload.single("avatar"), updateUser);
routes.delete("/users/:id", deleteUser);
//sector routes
routes.get("/sectors", getAllsectors);
routes.get("/sectors/:name", getSectorByName);
routes.post("/sectors", createSector);
routes.patch("/sectors/:name", updateSector);
routes.delete("/sectors/:name", deleteSector);
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
// recuperação de senha
routes.post("/login", login);
routes.post("/auth/forgot-password", forgotPassword);
routes.post("/auth/reset-password", resetPassword);
routes.post("/auth/verify-reset-token", verifyResetToken);
// only admin routes
routes.delete("/products", deleteAllProducts);
routes.delete("/defective-products", deleteAllDefectiveProducts);
export { routes };
