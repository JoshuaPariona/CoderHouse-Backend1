import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";

import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import ProductManager from "./controllers/product.controller.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

app.get("/realtime_products", (req, res) => {
  res.render("realTimeProducts");
});

const httpServer = app.listen(port, () => {
  console.log(`Server http://localhost:${port}/realtime_products`);
});

const io = new Server(httpServer);

//middleware to connect the io to the request
app.use((req, res, next) => {
  console.log("socket io middleware");
  req.io = io;
  next();
});

const productManager = new ProductManager();
io.on("connection", async (socket) => {
    const products = await productManager.getProducts();
    socket.emit("updateProductList", products);
});
