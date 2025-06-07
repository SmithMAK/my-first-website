// ─────────────────────────────────────────────────────────────────────────────
//                              cart.js
// ─────────────────────────────────────────────────────────────────────────────

// Immediately‐invoked to avoid polluting global namespace
const Cart = (function() {
    const STORAGE_KEY = 'campingSwagCart';
  
    // Our “database” of products (so cart.html knows name/price/image):
    const PRODUCTS = {
      beachtent: {
        id: 'beachtent',
        name: 'Beach Tent',
        price: 149.95,
        images: [
          'assets/beach tent1.jpg',
          'assets/beach tent2.jpg',
          'assets/beach tent3.jpg',
          'assets/beach tent4.jpg'
        ],
        pageUrl: 'beachtent.html'
      },
      familytent: {
        id: 'familytent',
        name: 'Family Tent',
        price: 279.95,
        images: [
          'assets/family tent1.jpg',
          'assets/family tent2.jpg',
          'assets/family tent3.jpg',
          'assets/family tent4.jpg'
        ],
        pageUrl: 'familytent.html'
      },
      headtorch: {
        id: 'headtorch',
        name: 'Head Torch',
        price: 65.95,
        images: [
          'assets/headtorch1.jpg',
          'assets/headtorch2.jpg',
          'assets/headtorch3.jpg',
          'assets/headtorch4.jpg'
        ],
        pageUrl: 'headtorch.html'
      },
      backpack: {
        id: 'backpack',
        name: '35 L Backpack',
        price: 49.95,
        images: [
          'assets/backpack1.jpg',
          'assets/backpack2.jpg',
          'assets/backpack3.jpg',
          'assets/backpack4.jpg'
        ],
        pageUrl: 'backpack.html'
      },
    };
  
    // Read the cart object from localStorage (or return {} if empty)
    function getCart() {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    }
  
    // Write the cart object back to localStorage, then refresh the header count
    function saveCart(cart) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateCartCount();
    }
  
    // Increase quantity of a product by 1
    function addToCart(productId) {
      const cart = getCart();
      if (cart[productId]) {
        cart[productId] += 1;
      } else {
        cart[productId] = 1;
      }
      saveCart(cart);
    }
  
    // Decrease quantity by 1, removing product if quantity ≤ 0
    function removeFromCart(productId) {
      const cart = getCart();
      if (!cart[productId]) return;
      cart[productId] -= 1;
      if (cart[productId] <= 0) {
        delete cart[productId];
      }
      saveCart(cart);
    }
  
    // Set an exact quantity (useful for input fields or direct sets)
    function setQuantity(productId, quantity) {
      const cart = getCart();
      if (quantity <= 0) {
        delete cart[productId];
      } else {
        cart[productId] = quantity;
      }
      saveCart(cart);
    }
  
    // Return total number of items (sum of all quantities)
    function getTotalCount() {
      const cart = getCart();
      return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    }
  
    // Repaint the “cart‐icon” count in the header
    function updateCartCount() {
      const count = getTotalCount();
      const countSpan = document.querySelector('.cart-count');
      if (countSpan) {
        countSpan.textContent = count;
      }
    }
  
    // Remove all items from cart
    function clearCart() {
      localStorage.removeItem(STORAGE_KEY);
      updateCartCount();
    }
  
    // Expose PRODUCTS and the API methods
    return {
      PRODUCTS,
      getCart,
      addToCart,
      removeFromCart,
      setQuantity,
      getTotalCount,
      updateCartCount,
      clearCart
    };
  })();
  
  // Whenever the DOM is ready, make sure to show the correct cart count in header:
  document.addEventListener('DOMContentLoaded', function() {
    Cart.updateCartCount();
  });
  
  