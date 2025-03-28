import Cart from "../models/cart.model.js";

export default class CartManager {
  async getCarts() {
    try {
      const carts = await Cart.find().lean();
      return carts.map((c) => {
        c.id = c._id.toString();
        return c;
      });
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      return [];
    }
  }

  async createCart() {
    try {
      const newCart = await Cart.create({ products: [] });
      return {
        ...newCart,
        id: newCart._id.toString(),
      };
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  }

  async updateProductInCart(cid, pid, action, quantity) {
    try {
      const cart = await Cart.findById(cid).populate("products.product").exec();
      if (!cart) return [null, false];

      const productIndex = cart.products.findIndex(
        (p) => p.product?._id.toString() === pid
      );

      if (productIndex === -1) {
        if (action === "add") {
          cart.products.push({ product: pid, quantity });
        }
      } else {
        switch (action) {
          case "add": {
            const stock = cart.products[productIndex].product.stock;
            if (cart.products[productIndex].quantity + quantity > stock) {
              return [cart, false];
            }
            cart.products[productIndex].quantity += quantity;
            break;
          }
          case "remove":
            cart.products[productIndex].quantity -= quantity;
            if (cart.products[productIndex].quantity <= 0) {
              cart.products.splice(productIndex, 1);
            }
            break;
          case "removeall":
            cart.products.splice(productIndex, 1);
            break;
          default:
            return [cart, false];
        }
      }
      await cart.save();
      await cart.populate("products.product");
      return [cart.toObject(), true];
    } catch (error) {
      console.error("Error al actualizar el producto en el carrito:", error);
      return [null, false];
    }
  }

  async getCart(cid) {
    try {
      const cart = await Cart.findById(cid).populate("products.product").exec();
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return null;
    }
  }
}

/*
  async addProductInCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.id === cid);
      if (cartIndex === -1)
        throw new Error(`Carrito con ID ${cid} no encontrado`);

      const cart = carts[cartIndex];
      const productIndex = cart.products.findIndex((p) => p.id === pid);
      if (productIndex !== -1) {
        cart.products[productIndex].quantity++;
      }
      else {
        cart.products.push({ id: pid, quantity: 1 });
      }
      await writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf-8");
      console.log("Producto agregado al carrito:", pid);
      return cart;
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      return null;
    }
  }
  */
