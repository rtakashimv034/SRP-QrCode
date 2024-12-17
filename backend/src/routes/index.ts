import express from "express";

const routes = express.Router();

routes.get("/camera-managment", getAllCameras);
routes.get("/books/:id", getBookById);
routes.post("/books", createBook);
routes.put("/books/:id", updateBook);
routes.delete("/books/:id", deleteBook);

export { routes };
