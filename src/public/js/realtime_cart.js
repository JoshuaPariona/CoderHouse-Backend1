let cartId = undefined;

const errorOverlay = document.getElementById("errorOverlay");
const cartList = document.getElementById("cartList");

function TinyProductCard(p) {
  if (!p.product) return;
  const container = document.createElement("a");
  container.classList.add("tinyProductCard");
  container.href = `/product/${p.product._id}`;
  container.innerHTML = `
    <div class="p-details">
      <h2>${p.product.title}</h2>
      <small>${p.product._id}</small>
    </div>
    <div>
      <div class="counter">
        <button id="decrement" >-</button>
        <p type="number" id="counterValue-${p.product._id}" class="label">1</p>
        <button id="increment">+</button>
      </div>
      <button class="delProd">
        Eliminar
      </button>
    </div>
  `;
  cartList.appendChild(container);
}

async function setCart(cart) {
  cartList.innerHTML = "";
  cart.products.forEach(TinyProductCard);
}

async function getCart() {
  if (!cartId) {
    errorOverlay.classList.add("show");
  }
  try {
    const res = await fetch(`/api/carts/${cartId}`);
    if (res.ok) {
      cart = await res.json();
      setCart(cart);
    } else {
      errorOverlay.classList.add("show");
    }
  } catch (e) {
    errorOverlay.classList.add("show");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cartIdInput = document.getElementById("param-cart-id");
  cartId = cartIdInput.value;
  getCart();
});
