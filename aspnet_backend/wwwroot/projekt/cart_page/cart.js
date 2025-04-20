
document.getElementById("menu-toggle").addEventListener("click", function () {
  const nav = document.getElementById("nav");
  nav.classList.toggle("show");
});

document.addEventListener('DOMContentLoaded', () => {
  localStorage.setItem("userId", userIdFromLoginResponse);
  const cartContainer = document.getElementById('cart-items');
  const totalContainer = document.getElementById('total');
  const orderSection = document.getElementById('order-section');

  if (!userId) {
      cartContainer.innerHTML = '<p>Please log in to view your cart.</p>';
      return;
  }

  async function fetchCart() {
      try {
          const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
          const cartItems = await res.json();

          cartContainer.innerHTML = '';
          totalContainer.innerText = '';
          orderSection.style.display = 'none';

          // Filter valid items
          const validItems = cartItems.filter(item => item && item.name && item.imageUrl);

          if (validItems.length === 0) {
              cartContainer.innerHTML = '<p>Your cart is empty.</p>';
              return;
          }
          

          let total = 0;
          orderSection.style.display = 'block';

          validItems.forEach(item => {
              const subtotal = item.price * item.quantity;
              total += subtotal;

              const itemEl = document.createElement('div');
              itemEl.classList.add('cart-item');

              itemEl.innerHTML = `
                  <img src="/projekt/shop_page/${item.imageUrl}" alt="${item.name}" class="cart-image" />
                  <div class="cart-details">
                      <h3>${item.name}</h3>
                      <p>Price: $${item.price}</p>
                      <div class="qty-controls">
                          <button class="decrease" data-product-id="${item.id}">−</button>
                          <span class="quantity">${item.quantity}</span>
                          <button class="increase" data-product-id="${item.id}">+</button>
                      </div>
                      <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
                      <button class="remove-btn" data-product-id="${item.id}">Remove</button>
                  </div>
                  <hr>
              `;
              cartContainer.appendChild(itemEl);
          });

          totalContainer.innerText = `Total: $${total.toFixed(2)}`;
          attachEventListeners();

      } catch (err) {
          console.error('Error loading cart:', err);
          cartContainer.innerHTML = '<p>Failed to load cart.</p>';
      }
  }

  function attachEventListeners() {
      document.querySelectorAll('.remove-btn').forEach(btn => {
          btn.addEventListener('click', () => {
              const productId = btn.dataset.productId;
              fetch(`https://localhost:5001/api/cart/${userId}/${productId}`, {
                  method: 'DELETE'
              }).then(fetchCart);
          });
      });

      document.querySelectorAll('.increase').forEach(btn => {
          btn.addEventListener('click', () => {
              const productId = btn.dataset.productId;
              updateQuantity(productId, 1);
          });
      });

      document.querySelectorAll('.decrease').forEach(btn => {
          btn.addEventListener('click', () => {
              const productId = btn.dataset.productId;
              updateQuantity(productId, -1);
          });
      });
  }

  function updateQuantity(productId, change) {
    const userId = localStorage.getItem("userId");
    const currentQty = parseInt(document.querySelector(`[data-product-id="${productId}"]`).parentElement.querySelector(".quantity").innerText);
    const newQuantity = currentQty + change;

    fetch(`http://localhost:5000/api/cart/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userId: parseInt(userId),
            productId: parseInt(productId),
            quantity: newQuantity
        })
    }).then(() => location.reload());
}


});

