import { Router } from "express";
import CartManager from "../controllers/cart.controller.js";

const cartRouter = Router();
const cartManager = new CartManager();

cartRouter.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    console.log("Get de carritos: ", carts);
    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});

cartRouter.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    console.log("carrito creado", newCart);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

cartRouter.patch("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { action, quantity } = req.body; //add, remove, removeall
  try {
    if (!["add", "remove", "removeall"].includes(action)) {
      return res.status(400).json({ error: "Acción no permitida" });
    }
    if (!Number(quantity)) {
      return res
        .status(400)
        .json({ error: "Cantidad no válidam no es un numero" });
    }
    if (["add", "remove"].includes(action) && quantity < 1) {
      return res.status(400).json({
        error:
          "Cantidad no válida para add o remove, debe ser mayor o igual a 1",
      });
    }

    const [cart, isSuccess] = await cartManager.updateProductInCart(
      cid,
      pid,
      action,
      quantity
    );
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    if (!isSuccess) {
      return res.status(400).json({
        error: "No hay stock suficiente para agregar el producto al carrito",
      });
    }
    req.io.emit(`updateCart:${cart.cid}`, cart);
    console.log("carrito actualizado", cart);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
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
    console.log("carrito obtenido", cart);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

/*

cartRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body; //array of products ids
  try {
    //TODO: Implementar el método setProductsInCart en CartManager
    const cart = await cartManager.setProductsInCart(cid, products);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el carrito" });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    //TODO: Implementar el método deleteProductsInCart en CartManager
    const cart = await cartManager.deleteProductsInCart(cid, products);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
});


cartRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    //TODO: Implementar el método deleteProductsInCart en CartManager
    const cart = await cartManager.deleteProductsInCart(cid, pid);
    if (!cart) {
      return res
        .status(404)
        .json({ error: `Carrito con ID ${cid} no encontrado` });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto al carrito" });
  }
});

cartRouter.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    //TODO: Implementar el método setProductQuantity en CartManager
    const cart = await cartManager.setProductQuantity(cid, pid, Number(quantity));
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
*/
export default cartRouter;
