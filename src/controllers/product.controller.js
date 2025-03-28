import Product from "../models/product.model.js";

export default class ProductManager {
  async getProducts(limit, page, sort, query) {
    try {
      const sortOrder = sort === "desc" ? -1 : 1;
      const filter =
        query !== "none"
          ? { $or: [{ category: query }, { status: query }] }
          : {};
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort === "none" ? undefined : { price: sortOrder },
        lean: true,
      };

      const result = await Product.paginate(filter, options);
      const products_metadata = {
				payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}`
          : null,
        nextLink: result.hasNextPage
          ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}`
          : null,
      };
      return products_metadata;
    } catch (error) {
      console.error("Error al leer los productos:", error);
      return [];
    }
  }

  async getProduct(pid) {
    try {
      const product = await Product.findById(pid).lean();
      if (!product) throw new Error(`Producto con ID ${pid} no encontrado`);
      return product;
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      return null;
    }
  }

  async addProduct(product) {
    try {
      const newProduct = await Product.create(product);
      console.log("Producto agregado:", newProduct);
      const products = await this.getProducts(10, 1, "none", "none");
      return [newProduct, products];
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async updateProduct(pid, product) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(pid, product, {
        new: true,
      });

      if (!updatedProduct)
        throw new Error(`Producto con ID ${pid} no encontrado`);

      console.log("Producto actualizado:", updatedProduct);

      const products = await this.getProducts(10, 1, "none", "none");
      return [updatedProduct, products];
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  }

  async deleteProduct(pid) {
    try {
      const deletedProduct = await Product.findByIdAndDelete(pid);

      if (!deletedProduct) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }
      console.log(`Producto con ID ${pid} eliminado`);

			const products = await this.getProducts(10, 1, "none", "none");
      return [true, products];
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      return false;
    }
  }
}
