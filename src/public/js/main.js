const socket = io();
const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const modalOverlay = document.getElementById("modalOverlay");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", () => modalOverlay.style.display = "flex");
closeModal.addEventListener("click", () => modalOverlay.style.display = "none");
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.style.display = "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
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

  const res = await fetch("api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  if (res.ok) {
    console.log("Producto agregado correctamente");
    form.reset();
  }
});

const deleteProduct = (id) => {
  const res = fetch(`api/products/${id}`, { method: "DELETE" });
  if (res.ok) {
    console.log("Producto eliminado correctamente");
  }
};

const ProductCard = (product) => {
  const li = document.createElement("li");
  li.classList.add("product-card");
  li.innerHTML = `
    <h3>${product.title}</h3>
    <h5>${product.id}</h5>
    <p>${product.description}</p>
    <p><strong>Precio:</strong> $${product.price}</p>
    <p><strong>Stock:</strong> ${product.stock} unidades</p>
    <p><strong>Categoría:</strong> ${product.category}</p>
    <button onclick="deleteProduct('${product.id}')">Eliminar</button>
  `;
  list.appendChild(li);
};

socket.on("updateProductList", (products) => {
  list.innerHTML = "";
  products.forEach(ProductCard);
});
