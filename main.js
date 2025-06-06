/* ─────────────────────────────────────────────────────────────────────────────
   MAIN.JS
───────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  /*───────────────────────────────────────────────────────────────────────────
    SLIDESHOW (Home Page)
  ────────────────────────────────────────────────────────────────────────────*/
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "flex" : "none";
      dots[i].classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  if (slides.length > 0) {
    showSlide(slideIndex);
    setInterval(nextSlide, 4000); // change every 4s
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const idx = parseInt(this.getAttribute("data-index"));
      slideIndex = idx;
      showSlide(slideIndex);
    });
  });

  /*───────────────────────────────────────────────────────────────────────────
    FILTER DROPDOWN (Search Page Only)
  ────────────────────────────────────────────────────────────────────────────*/
  const filterToggle = document.getElementById("filter-toggle");
  const filterMenu = document.getElementById("filter-menu");
  const currentFilterSpan = document.getElementById("current-filter");
  const productCards = document.querySelectorAll(".product-card");

  function closeFilterMenu() {
    filterMenu.style.display = "none";
  }

  function openFilterMenu() {
    filterMenu.style.display = "block";
  }

  if (filterToggle) {
    filterToggle.addEventListener("click", function (e) {
      e.preventDefault();
      if (filterMenu.style.display === "block") {
        closeFilterMenu();
      } else {
        openFilterMenu();
      }
    });
  }

  if (filterMenu) {
    filterMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const selected = this.getAttribute("data-filter");
        currentFilterSpan.innerText = selected;
        applyFilter(selected);
        closeFilterMenu();
      });
    });

    document.addEventListener("click", function (e) {
      if (
        filterMenu.style.display === "block" &&
        !filterMenu.contains(e.target) &&
        e.target !== filterToggle
      ) {
        closeFilterMenu();
      }
    });
  }

  function applyFilter(filterName) {
    productCards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      if (filterName === "All" || cat === filterName) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialFilter = urlParams.get("filter");
  if (initialFilter) {
    currentFilterSpan.innerText = initialFilter;
    applyFilter(initialFilter);
  }

  /*───────────────────────────────────────────────────────────────────────────
    PRODUCT IMAGE CAROUSEL + QUANTITY CONTROLS (Search Page Only)
  ────────────────────────────────────────────────────────────────────────────*/
  document.querySelectorAll(".product-card").forEach((card) => {
    const imgEl = card.querySelector(".product-img");
    const prevBtn = card.querySelector(".prev-img");
    const nextBtn = card.querySelector(".next-img");
    const qtyNumber = card.querySelector(".qty-number");
    const increaseBtn = card.querySelector(".qty-increase");
    const decreaseBtn = card.querySelector(".qty-decrease");

    // Parse the JSON array of images from data-images
    const images = JSON.parse(imgEl.getAttribute("data-images"));
    let idx = 0;

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        idx = (idx - 1 + images.length) % images.length;
        imgEl.src = images[idx];
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        idx = (idx + 1) % images.length;
        imgEl.src = images[idx];
      });
    }

    // Quantity controls
    let qty = 0;
    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        qty++;
        qtyNumber.innerText = qty;
      });
    }
    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        if (qty > 0) qty--;
        qtyNumber.innerText = qty;
      });
    }
  });
});


// ─────────────────────────────────────────────────────────────────────────────
//                          main.js (all pages use this file)
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // 1) Initialize / update the cart‐count badge in the header
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  updateCartBadge();

  // 2) On product pages: attach “Add to Cart” buttons (they have class .add-to-cart-btn)
  document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Each product page must set window.PRODUCT_DATA = { id, name, price, image }
      // (see the product‐page HTML files we provided earlier).
      if (window.PRODUCT_DATA) {
        addItemToCart({ ...window.PRODUCT_DATA, quantity: 1 });
      }
    });
  });

  // 3) On search.html: attach “＋” and “－” buttons to update cart directly from the grid
  document.querySelectorAll(".qty-btn").forEach((qtyBtn) => {
    qtyBtn.addEventListener("click", (e) => {
      const parentCard = e.currentTarget.closest(".product-card");
      if (!parentCard) return;

      // We assume each .product-card element has data attributes set:
      // data-id, data-name, data-price, data-image
      const id = parentCard.getAttribute("data-id");
      const name = parentCard.getAttribute("data-name");
      const price = parseFloat(parentCard.getAttribute("data-price"));
      const image = parentCard.getAttribute("data-image");

      // Determine if this is “plus” or “minus”
      const isPlus = e.currentTarget.classList.contains("plus-btn");
      changeItemQuantity(id, name, price, image, isPlus ? 1 : -1);

      // Also update the visible quantity number inside that card
      const qtyNumberEl = parentCard.querySelector(".qty-number");
      let currentQty = parseInt(qtyNumberEl.textContent || "0", 10);
      currentQty = isPlus ? currentQty + 1 : Math.max(0, currentQty - 1);
      qtyNumberEl.textContent = currentQty;
    });
  });

  // 4) If we are on cart.html (it has an element with ID #cart-content), render the cart
  if (document.getElementById("cart-content")) {
    renderCartPage();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Utility Functions
  // ────────────────────────────────────────────────────────────────────────────

  // Update the red badge in the header
  function updateCartBadge() {
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector(".cart-count");
    if (badge) {
      badge.textContent = totalCount;
    }
  }

  // Add a new item or bump quantity if it already exists
  function addItemToCart(product) {
    const existing = cartItems.find((ci) => ci.id === product.id);
    if (existing) {
      existing.quantity += product.quantity;
    } else {
      cartItems.push({ ...product });
    }
    // Remove any product with zero quantity
    cartItems = cartItems.filter((ci) => ci.quantity > 0);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartBadge();
    if (document.getElementById("cart-content")) {
      renderCartPage();
    }
  }

  // Change quantity by delta (±1). If not found, create a new entry with quantity=1
  function changeItemQuantity(id, name, price, image, delta) {
    const existing = cartItems.find((ci) => ci.id === id);
    if (existing) {
      existing.quantity = Math.max(0, existing.quantity + delta);
      if (existing.quantity === 0) {
        // Remove entirely if quantity is zero
        cartItems = cartItems.filter((ci) => ci.id !== id);
      }
    } else if (delta > 0) {
      cartItems.push({ id, name, price, image, quantity: 1 });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartBadge();
    if (document.getElementById("cart-content")) {
      renderCartPage();
    }
  }

  // Render the cart page’s contents (list of items or empty state)
  function renderCartPage() {
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const container = document.getElementById("cart-content");
    const summaryEl = document.getElementById("cart-summary");
    container.innerHTML = ""; // clear first

    if (!cartItems || cartItems.length === 0) {
      // Show empty‐cart box
      container.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>No items in your cart</p>
        </div>`;
      summaryEl.style.display = "none";
      return;
    }

    // Otherwise, build each .cart-item row
    cartItems.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.classList.add("cart-item");
      itemEl.setAttribute("data-id", item.id);

      itemEl.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          <div class="item-quantity">
            <button class="qty-btn minus-btn" aria-label="Decrease quantity">–</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn plus-btn" aria-label="Increase quantity">＋</button>
          </div>
        </div>
      `;

      container.appendChild(itemEl);
    });

    // Show the summary (total + checkout)
    summaryEl.style.display = "flex";
    updateCartTotal();

    // Attach listeners to the new quantity buttons
    container.querySelectorAll(".minus-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parentItem = e.currentTarget.closest(".cart-item");
        const prodId = parentItem.getAttribute("data-id");
        const existing = cartItems.find((ci) => ci.id === prodId);
        if (!existing) return;
        changeItemQuantity(prodId, existing.name, existing.price, existing.image, -1);
      });
    });
    container.querySelectorAll(".plus-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parentItem = e.currentTarget.closest(".cart-item");
        const prodId = parentItem.getAttribute("data-id");
        const existing = cartItems.find((ci) => ci.id === prodId);
        if (!existing) return;
        changeItemQuantity(prodId, existing.name, existing.price, existing.image, +1);
      });
    });
  }

  // Compute and display the total sum of all items
  function updateCartTotal() {
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalEl = document.querySelector(".total-amount");
    if (totalEl) {
      totalEl.textContent = `$${totalAmount.toFixed(2)}`;
    }
  }
});
