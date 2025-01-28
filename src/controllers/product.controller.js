import { readFile, writeFile, access } from 'fs/promises';
import crypto from 'crypto';
import path from 'path';


export default class ProductManager {
	filePath =  'src/data/products.json';

	constructor() {
		this.initFile();
	}

	async initFile() {
		try {
			await access(this.filePath);
		} catch (error) {
			await writeFile(this.filePath, '[]');
		}
	}

	async getProducts() {
		try {
			const data = await readFile(this.filePath, 'utf-8');
			return JSON.parse(data);
		} catch (error) {
			console.error('Error al leer los productos:', error);
			return [];
		}
	}

	async getProduct(pid) {
		try {
			const products = await this.getProducts();
			const product = products.find(p => p.id === pid);
			if (!product) throw new Error(`Producto con ID ${pid} no encontrado`);
			return product;
		} catch (error) {
			console.error('Error al obtener el producto:', error);
			return null;
		}
	}

	async addProduct(product) {
		try {
			const products = await this.getProducts();
			const newProduct = { id: this.generateId(), ...product };
			products.push(newProduct);
			await writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
			console.log('Producto agregado:', newProduct);
			return newProduct;
		} catch (error) {
			console.error('Error al agregar el producto:', error);
		}
	}

	async updateProduct(pid, updatedProduct) {
		try {
			const products = await this.getProducts();
			const productIndex = products.findIndex(p => p.id === pid);
			if (productIndex === -1) throw new Error(`Producto con ID ${pid} no encontrado`);

			products[productIndex] = { ...products[productIndex], ...updatedProduct };

			await writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
			console.log('Producto actualizado:', products[productIndex]);
			return products[productIndex];
		} catch (error) {
			console.error('Error al actualizar el producto:', error);
		}
	}

	async deleteProduct(pid) {
		try {
			const products = await this.getProducts();
			const filteredProducts = products.filter(p => p.id !== pid);

			if (filteredProducts.length === products.length) {
				throw new Error(`Producto con ID ${pid} no encontrado`);
			}

			await writeFile(this.filePath, JSON.stringify(filteredProducts, null, 2), 'utf-8');
			console.log(`Producto con ID ${pid} eliminado`);
			return true;
		} catch (error) {
			console.error('Error al eliminar el producto:', error);
			return false;
		}
	}

	generateId() {
		return crypto.randomUUID();
	}
}