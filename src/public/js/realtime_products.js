const socket = io();

const spinner = document.getElementById("spinner");

const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const cartsContainer = document.getElementById("cartsContainer");
const selectedProduct = document.getElementById("selectedProduct");

const modalOverlay = document.getElementById("modalOverlay");
const closeModal = document.getElementById("closeModal");
const openModal = document.getElementById("openModal");

const delOverlay = document.getElementById("delOverlay");
const closeDelModal = document.getElementById("closeDelModal");
const delProduct = document.getElementById("delProduct");

const openCartModal = document.getElementById("openCartModal");
const modalCartOverlay = document.getElementById("modalCartOverlay");
const closeCartModal = document.getElementById("closeCartModal");
const currentCart = document.getElementById("currentCart");

const submitProduct = document.getElementById("submitProduct");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageCounter = document.getElementById("pageCounter");

const createCartButton = document.getElementById("createCart");

let currentPage = 1;
let totalPages = 1;
let nextLink = null;
let prevLink = null;
let selectedProductId = undefined;

let sort = "none"; // none | asc | desc
let query = "none"; // string
let limit = 10; // number

let currentCartId = localStorage.getItem("currentCartId");

const ToastyMsg = (msg, isSuccess) => {
  Toastify({
    text: msg,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: isSuccess
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : "linear-gradient(to right,rgb(219, 223, 32),rgb(201, 105, 61))",
    },
  }).showToast();
};

const setProducts = (products) => {
  list.innerHTML = "";
  products.forEach(ProductCard);
};

const updatePagination = (pagination) => {
  currentPage = pagination.page;
  prevLink = pagination.prevLink;
  if (prevLink) prevPage.disabled = false;
  else prevPage.disabled = true;
  nextLink = pagination.nextLink;
  if (nextLink) nextPage.disabled = false;
  else nextPage.disabled = true;
  totalPages = pagination.totalPages;
  pageCounter.innerHTML = `${currentPage} / ${totalPages}`;
};

const getFilteredProducts = async (page, limit, sort, query) => {
  try {
    const res = await fetch(
      `api/products?page=${page}&limit=${limit}&sort=${sort}&query=${query}`
    );
    const productsM = await res.json();
    spinner.classList.add("discard");
    setProducts(productsM.payload);
    updatePagination(productsM);
  } catch (e) {
    ToastyMsg("Error al cargar los productos", false);
    spinner.classList.add("discard");
  }
};

const CartCard = (cart) => {
  const container = document.createElement("button");
  container.classList.add("cart-button");
  container.innerHTML = `Carrito: ${cart.id}`;
  container.id = cart.id;
  container.onclick = async () => {
    currentCart.innerHTML = `Ir a Carrito: ${cart.id}`;
    currentCart.href = `/realtime_cart/${cart.id}`;
    cartsContainer.childNodes.forEach((c) => {
      if (c.id === cart.id) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
    currentCartId = cart.id;
    localStorage.setItem("currentCartId", cart.id);
  };
  cartsContainer.appendChild(container);
};

const getCarts = async () => {
  try {
    const res = await fetch("api/carts");
    const carts = await res.json();
    if (carts.length === 0) {
      cartsContainer.innerHTML = "No hay carritos aun";
      return;
    }
    cartsContainer.innerHTML = "";
    carts.forEach(CartCard);
  } catch (error) {
    cartsContainer.innerHTML = "No hay carritos aun";
    console.error("Error al obtener los carritos", error);
    ToastyMsg("Error al obtener los carritos", false);
  }
};

const createCart = async () => {
  try {
    createCartButton.disabled = true;
    createCartButton.innerHTML = "<div class='spinner'></div>";
    const res = await fetch("api/carts", { method: "POST" });
    const cart = await res.json();
    CartCard(cart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    ToastyMsg("Error al crear carrito", false);
  } finally {
    createCartButton.disabled = false;
    createCartButton.innerHTML = "Crear Carrito";
  }
};

getCarts().then(() => {
  if (currentCartId) {
    currentCart.innerHTML = `Ir a Carrito: ${currentCartId}`;
    currentCart.href = `/realtime_cart/${currentCartId}`;
    cartsContainer.childNodes.forEach((c) => {
      if (c.id === currentCartId) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
  }
});

createCartButton.addEventListener("click", createCart);

document.addEventListener("DOMContentLoaded", () => {
  getFilteredProducts(1, 10, "none", "none");
});

prevPage.addEventListener("click", async () => {
  if (prevLink) {
    console.log("prevLink");
    const res = await fetch(prevLink);
    const productsM = await res.json();
    setProducts(productsM.payload);
    updatePagination(productsM);
  }
});

nextPage.addEventListener("click", async () => {
  if (nextLink) {
    console.log("nextLink");
    const res = await fetch(nextLink);
    const productsM = await res.json();
    setProducts(productsM.payload);
    updatePagination(productsM);
  }
});

openModal.addEventListener("click", () => modalOverlay.classList.add("show"));
closeModal.addEventListener("click", () =>
  modalOverlay.classList.remove("show")
);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("show");
});

openCartModal.addEventListener("click", () =>
  modalCartOverlay.classList.add("show")
);
closeCartModal.addEventListener("click", () =>
  modalCartOverlay.classList.remove("show")
);
modalCartOverlay.addEventListener("click", (e) => {
  if (e.target === modalCartOverlay) modalCartOverlay.classList.remove("show");
});

delOverlay.addEventListener("click", (e) => {
  if (e.target === delOverlay) delOverlay.classList.remove("show");
});
closeDelModal.addEventListener("click", () =>
  delOverlay.classList.remove("show")
);
delProduct.addEventListener("click", async (e) => {
  if (selectedProductId) {
    try {
      delProduct.disabled = true;
      delProduct.innerHTML = "<div class='spinner'></div>";
      const res = await fetch(`api/products/${selectedProductId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        ToastyMsg("Producto eliminado correctamente", true);
      } else {
        ToastyMsg("Error al eliminar el producto", false);
      }
    } catch (error) {
      ToastyMsg("Error al eliminar el producto", false);
    } finally {
      delProduct.disabled = false;
      delProduct.innerHTML = "Aceptar";
      delOverlay.classList.remove("show");
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitProduct.disabled = true;
  submitProduct.innerHTML = "<div class='spinner'></div>";

  const title = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const status = true;
  const thumbnails = ["image/image1.jpg", "image/image2.jpg"];

  const product = {
    title,
    description,
    code,
    price,
    stock,
    category,
    status,
    thumbnails,
  };

  try {
    const res = await fetch("api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      form.reset();
      ToastyMsg("Producto creado correctamente", true);
    } else {
      ToastyMsg("Error al crear el producto", false);
    }
  } catch (error) {
    ToastyMsg("Error al crear el producto", false);
  } finally {
    submitProduct.disabled = false;
    submitProduct.innerHTML = "Agregar Producto";
    modalOverlay.classList.remove("show");
  }
});

const deleteProduct = async (event, id) => {
  event.preventDefault();
  selectedProductId = id;
  selectedProduct.textContent = id;
  delOverlay.classList.add("show");
};

const addToCart = async (event, id) => {
  event.preventDefault();
  try {
    if (!currentCartId) {
      ToastyMsg("Debes seleccionar un carrito para agregar productos", false);
      return;
    }
    const res = await fetch(`api/carts/${currentCartId}/product/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", quantity: 1 }),
    });
    if (res.ok) {
      const cart = await res.json();
      ToastyMsg("Producto agregado al carrito correctamente", true);
      console.log("cart", cart);
    } else {
      ToastyMsg("Error al agregar el producto al carrito", false);
    }
  } catch (error) {
    console.error("Error al agregar el producto al carrito", error);
    ToastyMsg("Error al agregar el producto al carrito", false);
  }
};

const ProductCard = (product) => {
  const container = document.createElement("a");
  container.classList.add("product-card");
  container.href = `/product/${product.id}`;
  container.innerHTML = `
    <h3>${product.title}</h3>
    <h5>${product.id}</h5>
    <p>${product.description}</p>
    <p><strong>Precio:</strong> $ ${product.price}</p>
    <p><strong>Stock:</strong> ${product.stock} unidades</p>
    <p><strong>Categoría:</strong> ${product.category}</p>
    <button class="addCart modalButton" onclick="addToCart(event,'${product.id}')">Agregar al carrito</button>
    <button class="delProd" id="del-${product.id}" onclick="deleteProduct(event,'${product.id}')">Eliminar</button>
  `;
  list.appendChild(container);
};

socket.on("updateProductList", (productsM) => {
  ToastyMsg(
    "Lista de productos actualizada correctamente, reset pages and querys",
    true
  );
  setProducts(productsM.payload);
  updatePagination(productsM);
  sort = "none";
  query = "none";
  limit = 10;
});
