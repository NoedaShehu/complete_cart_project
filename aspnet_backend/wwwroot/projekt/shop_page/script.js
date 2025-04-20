document.getElementById("menu-toggle").addEventListener("click", function () {
    const nav = document.getElementById("nav");
    nav.classList.toggle("show");
  });
  
document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("show");
        });
    }
});


async function addToCart(productId) {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const res = await fetch('https://localhost:5000/api/cart', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), productId, quantity: 1 })
    });

    const data = await res.json();
    if (res.ok) {
        console.log("Item added");
    } else {
        console.error("Failed to add", data);
    }
}
