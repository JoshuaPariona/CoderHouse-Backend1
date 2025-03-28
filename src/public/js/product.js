let productId;
let product;
let productCount = 1;
const currentCartId = localStorage.getItem("currentCartId");

const errorOverlay = document.getElementById("errorOverlay");

const productTitle = document.getElementById("product-title");
const productID = document.getElementById("product-id");
const productDesc = document.getElementById("product-description");
const productCode = document.getElementById("product-code");
const productPrice = document.getElementById("product-price");
const productStatus = document.getElementById("product-status");
const productStock = document.getElementById("product-stock");
const productCategory = document.getElementById("product-category");

const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const price = document.getElementById("price");
const pStatus = document.getElementById("status");
const stock = document.getElementById("stock");
const category = document.getElementById("category");

const editOverlay = document.getElementById("editOverlay");
const delOverlay = document.getElementById("delOverlay");
const addOverlay = document.getElementById("addOverlay");

const openAddModal = document.getElementById("openAddModal");
const openEditProductModal = document.getElementById("openEditProductModal");
const openDeleteProductModal = document.getElementById(
  "openDeleteProductModal"
);

const closeEditModal = document.getElementById("closeEditModal");
const closeDelModal = document.getElementById("closeDelModal");
const closeAddModal = document.getElementById("closeAddModal");

const editForm = document.getElementById("editForm");
const submitEdit = document.getElementById("submitEdit");
const delProduct = document.getElementById("delProduct");

const counterValue = document.getElementById("counterValue");
const decrement = document.getElementById("decrement");
const increment = document.getElementById("increment");
const addProduct = document.getElementById("addProduct");

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

function setProduct() {
  productTitle.textContent = product.title;
  productID.textContent = product._id;
  productDesc.textContent = product.description;
  productCode.textContent = product.code;
  productPrice.textContent = product.price;
  productStatus.textContent = product.status === "true" ? "Activo" : "Inactivo";
  productStock.textContent = product.stock;
  productCategory.textContent = product.category;
}

function setFormProduct() {
  title.value = product.title;
  description.value = product.description;
  code.value = product.code;
  price.value = product.price;
  pStatus.value = product.status;
  stock.value = product.stock;
  category.value = product.category;
}

function getFormProduct() {
  return {
    title: title.value,
    description: description.value,
    code: code.value,
    price: Number(price.value),
    status: pStatus.value === "true",
    stock: Number(stock.value),
    category: category.value,
  };
}

async function getProduct() {
  try {
    const res = await fetch(`/api/products/${productId}`);
    if (res.ok) {
      product = await res.json();
      setProduct();
      setFormProduct();
    } else {
      errorOverlay.classList.add("show");
    }
  } catch (e) {
    errorOverlay.classList.add("show");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productIdInput = document.getElementById("param-product-id");
  productId = productIdInput.value;
  getProduct();
});

openEditProductModal.addEventListener("click", (e) => {
  setFormProduct();
  editOverlay.classList.add("show");
});

editOverlay.addEventListener("click", (e) => {
  if (e.target === editOverlay) editOverlay.classList.remove("show");
});

closeEditModal.addEventListener("click", (e) => {
  editOverlay.classList.remove("show");
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!productId) return;
  submitEdit.disabled = true;
  submitEdit.innerHTML = "<div class='spinner'></div>";
  const updatedProduct = getFormProduct();
  try {
    const res = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    if (res.ok) {
      const newProduct = await res.json();
      editForm.reset();
      product = newProduct;
      productCount = 1;
      counterValue.textContent = productCount;
      setProduct();
      setFormProduct();
      ToastyMsg("Producto actualizado correctamente", true);
    } else {
      ToastyMsg("Error al actualizar el producto", false);
    }
  } catch (error) {
    ToastyMsg("Error al actualizar el producto", false);
  } finally {
    submitEdit.innerHTML = "Guardar cambios";
    submitEdit.disabled = false;
    editOverlay.classList.remove("show");
  }
});

openDeleteProductModal.addEventListener("click", (e) => {
  delOverlay.classList.add("show");
});

delOverlay.addEventListener("click", (e) => {
  if (e.target === delOverlay) delOverlay.classList.remove("show");
});

closeDelModal.addEventListener("click", (e) => {
  delOverlay.classList.remove("show");
});

delProduct.addEventListener("click", async (e) => {
  if (!productId) return;
  try {
    delProduct.disabled = true;
    delProduct.innerHTML = "<div class='spinner'></div>";
    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      ToastyMsg("Producto eliminado correctamente", true);
      window.location = "/realtime_products";
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
});

increment.addEventListener("click", () => {
  productCount = Math.min(productCount + 1, Number(product.stock));
  counterValue.textContent = productCount;
});

decrement.addEventListener("click", () => {
  productCount = Math.max(productCount - 1, 1);
  counterValue.textContent = productCount;
});

openAddModal.addEventListener("click", (e) => {
  addOverlay.classList.add("show");
});

addOverlay.addEventListener("click", (e) => {
  if (e.target === addOverlay) addOverlay.classList.remove("show");
});

closeAddModal.addEventListener("click", (e) => {
  addOverlay.classList.remove("show");
});

addProduct.addEventListener("click", async (e) => {
  if (!currentCartId) {
    ToastyMsg("Debes seleccionar un carrito para agregar productos", false);
    return;
  }
  if (!productId) {
    ToastyMsg("Producto no encontrado", false);
    return;
  }
  if (productCount < 1) {
    ToastyMsg("No es posible agregar cantidades negativas", false);
    return;
  }
  try {
    addProduct.disabled = true;
    addProduct.innerHTML = "<div class='spinner'></div>";
    const res = await fetch(
      `/api/carts/${currentCartId}/product/${productId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", quantity: productCount }),
      }
    );
    if (res.ok) {
      ToastyMsg("Producto agregado al carrito correctamente", true);
    } else {
      ToastyMsg("Error al agregar el producto al carrito", false);
    }
  } catch (error) {
    ToastyMsg("Error al agregar el producto al carrito", false);
  } finally {
    addProduct.disabled = false;
    addProduct.innerHTML = "Aceptar";
    addOverlay.classList.remove("show");
  }
});
