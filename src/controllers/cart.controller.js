import { readFile, writeFile, access } from "fs/promises";
import crypto from "crypto";

export default class CartManager {
  filePath =  "src/data/carts.json";

  constructor() {
    this.initFile();
  }

  async initFile() {
    try {
      await access(this.filePath);
    } catch (error) {
      await writeFile(this.filePath, "[]");
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const newCart = { id: this.generateId(), products: [] };
      carts.push(newCart);
      await writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf-8");
      console.log("Carrito creado:", newCart);
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
    }
  }

  async getCart(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cid);
      if (!cart) throw new Error(`Carrito con ID ${cid} no encontrado`);
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      return null;
    }
  }

  async getCarts() {
    try {
      const data = await readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      return [];
    }
  }

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

  generateId() {
    return crypto.randomUUID();
  }
}
