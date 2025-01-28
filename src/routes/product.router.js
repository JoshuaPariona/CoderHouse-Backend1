import { Router } from "express";
import ProductManager from "../controllers/product.controller.js";

const productRouter = Router();
const productManager = new ProductManager();

productRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

productRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productManager.getProduct(pid);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Producto con ID ${pid} no encontrado` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

productRouter.post("/", async (req, res) => {
  const product = req.body;
  try {
    const newProduct = await productManager.addProduct(product);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

productRouter.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  try {
    const product = await productManager.updateProduct(pid, updatedProduct);
    if (!product) {
      return res
        .status(404)
        .json({ error: `Producto con ID ${pid} no encontrado` });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: `Producto con ID ${pid} no encontrado` });
    }
    res.status(200).json({ message: `Producto con ID ${pid} eliminado` });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default productRouter;
