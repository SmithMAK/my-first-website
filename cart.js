// js/cart.js
let cartCount = 0;
const cartCounter = document.querySelector('#cart-count');

function addToCart() {
    cartCount++;
    cartCounter.innerText = cartCount;
    // optionally: store to localStorage
}
