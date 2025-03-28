import express from "express";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { createServer } from "http";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import ProductManager from "./controllers/product.controller.js";

const app = express();
const port = 8080;
const httpServer = createServer(app);
const io = new Server(httpServer);

function setAppMiddlewares() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("./src/public"));
  app.use((req, _, next) => {
    req.io = io;
    next();
  });
}

function setAppOptions() {
  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./src/views");
}

function setAppRoutes() {
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
}

function setAppViews() {
  app.get("/realtime_products", (req, res) => {
    res.render("realTimeProducts");
  });
  app.get("/product/:pid", (req, res) => {
    const productId = req.params.pid;
    res.render("product", { productId });
  });
  app.get("/realtime_cart/:cid", (req, res) => {
    const cartId = req.params.cid;
    res.render("realTimeCart", { cartId });
  });
}

function start() {
  mongoose
  .connect(
    "mongodb+srv://app_user:Up7E9REYrSLVNDLl@cluster0.smwxo.mongodb.net/app?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a MongoDB");
    setAppMiddlewares();
    setAppOptions();
    setAppRoutes();
    setAppViews();
    httpServer.listen(port, () => {
      console.log(`Server http://localhost:${port}/realtime_products`);
    });
  })
  .catch((err) => console.error("Error de conexión:", err));
}

start();