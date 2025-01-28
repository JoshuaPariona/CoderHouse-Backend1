import { Router } from "express";
import CartManager from "../controllers/cart.controller.js";

const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

cartRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCart(cid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.addProductInCart(cid, pid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default cartRouter;
