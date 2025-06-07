/* ─────────────────────────────────────────────────────────────────────────────
   main.js
───────────────────────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  //
  // ─── SLIDESHOW (Home page) ────────────────────────────────────────────────
  //
  let slideIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const dots   = document.querySelectorAll(".dot");

  function showSlide(idx) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === idx);
      dots[i].classList.toggle("active", i === idx);
    });
  }

if (slides.length && slides.length === dots.length) {
  showSlide(slideIndex);
  setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 4000);

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      slideIndex = Number(dot.dataset.index);
      showSlide(slideIndex);
    });
  });
}
  //
  // ─── FILTER DROPDOWN (Search page only) ───────────────────────────────────
  //
  const filterToggle      = document.getElementById("filter-toggle");
  const filterMenu        = document.getElementById("filter-menu");
  const currentFilterSpan = document.getElementById("current-filter");
  const productCards      = document.querySelectorAll(".product-card");

  function openFilter()  { filterMenu.style.display = "block";  }
  function closeFilter() { filterMenu.style.display = "none";   }

  if (filterToggle && filterMenu && currentFilterSpan) {
    filterToggle.addEventListener("click", e => {
      e.preventDefault();
      filterMenu.style.display === "block" ? closeFilter() : openFilter();
    });

    // choose a filter
    filterMenu.querySelectorAll("a[data-filter]").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const sel = link.dataset.filter;
        currentFilterSpan.innerText = sel;
        applyFilter(sel);
        closeFilter();
      });
    });

    // click outside to close
    document.addEventListener("click", e => {
      if (
        filterMenu.style.display === "block" &&
        !filterMenu.contains(e.target) &&
        e.target !== filterToggle
      ) closeFilter();
    });

    // initial URL-based filter?
    const urlFs = new URLSearchParams(window.location.search).get("filter");
    if (urlFs) {
      currentFilterSpan.innerText = urlFs;
      applyFilter(urlFs);
    }
  }

  function applyFilter(name) {
    const lower = name.toLowerCase();
    productCards.forEach(card => {
      const cat = card.dataset.category?.toLowerCase() || "";
      card.style.display =
        lower === "all" || cat === lower ? "flex" : "none";
    });
  }

  //
  // ─── FAVORITE (heart) BUTTON TOGGLE ────────────────────────────────────────
  //
  document.querySelectorAll(".favorite-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const icon = btn.querySelector("i.fa-heart");
      icon.classList.toggle("far");
      icon.classList.toggle("fas");
    });
  });

  //
  // ─── PRODUCT‐GRID IMAGE CAROUSEL ───────────────────────────────────────────
  //
  const productImages = {
    beachtent: [
      "assets/beach tent1.jpg",
      "assets/beach tent2.jpg",
      "assets/beach tent3.jpg",
      "assets/beach tent4.jpg",
    ],
    familytent: [
      "assets/family tent1.jpg",
      "assets/family tent2.jpg",
      "assets/family tent3.jpg",
      "assets/family tent4.jpg",
    ],
    headtorch: [
      "assets/headtorch1.jpg",
      "assets/headtorch2.jpg",
      "assets/headtorch3.jpg",
      "assets/headtorch4.jpg",
    ],
    backpack: [
      "assets/backpack1.jpg",
      "assets/backpack2.jpg",
      "assets/backpack3.jpg",
      "assets/backpack4.jpg",
    ],
  };

  document.querySelectorAll(".product-image-wrapper").forEach(wrapper => {
    // get this product’s ID from either wrapper.dataset.id or the prev button
    const prevBtn = wrapper.querySelector(".prev-img");
    const id = wrapper.dataset.id || prevBtn.dataset.id;
    const imgs = productImages[id] || [];
    if (!imgs.length) return;

    const imgEl   = wrapper.querySelector(".product-img");
    const nextBtn = wrapper.querySelector(".next-img");
    // start at first image
    wrapper.dataset.currentIndex = 0;
    imgEl.src = imgs[0];

    prevBtn.addEventListener("click", () => {
      let idx = +wrapper.dataset.currentIndex - 1;
      idx = (idx + imgs.length) % imgs.length;
      wrapper.dataset.currentIndex = idx;
      imgEl.src = imgs[idx];
    });
    nextBtn.addEventListener("click", () => {
      let idx = +wrapper.dataset.currentIndex + 1;
      idx %= imgs.length;
      wrapper.dataset.currentIndex = idx;
      imgEl.src = imgs[idx];
    });
  });

  //
  // ─── CART LOGIC (all pages) ────────────────────────────────────────────────
  //
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
  updateCartBadge();

  // header badge updater
  function updateCartBadge() {
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    document.querySelectorAll(".cart-count").forEach(b => {
      b.textContent = count;
    });
  }

  // add or change quantity
  function saveCart() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartBadge();
    if (document.getElementById("cart-content")) renderCartPage();
  }

  function addOrChange(id, name, price, image, delta) {
    const existing = cartItems.find(i => i.id === id);
    if (existing) {
      existing.quantity = Math.max(0, existing.quantity + delta);
      if (existing.quantity === 0) {
        cartItems = cartItems.filter(i => i.id !== id);
      }
    } else if (delta > 0) {
      cartItems.push({ id, name, price, image, quantity: delta });
    }
    saveCart();
  }

  // hook “＋” / “－” on search.html
  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const card = e.currentTarget.closest(".product-card");
      const { id, name, price, image } = card.dataset;
      const delta = e.currentTarget.getAttribute("data-action") === "increase" ? 1 : -1;
      addOrChange(id, name, parseFloat(price), image, delta);
      // update displayed number
      const span = card.querySelector(".qty-number");
      let n = parseInt(span.textContent, 10) || 0;
      n = Math.max(0, n + delta);
      span.textContent = n;
    });
  });

  // hook Add-to-Cart on single product pages
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!window.PRODUCT_DATA) return;
      addOrChange(
        window.PRODUCT_DATA.id,
        window.PRODUCT_DATA.name,
        window.PRODUCT_DATA.price,
        window.PRODUCT_DATA.image,
        1
      );
      // swap to qty controls if present
      const controls = document.getElementById("qty-controls");
      const addBtn   = document.getElementById("add-cart-btn");
      if (controls && addBtn) {
        addBtn.style.display = "none";
        controls.style.display = "flex";
        document.getElementById("qty-number").textContent = 1;
      }
    });
  });

  // CART PAGE RENDER
  if (document.getElementById("cart-content")) renderCartPage();

  function renderCartPage() {
    cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const container = document.getElementById("cart-content");
    const summary   = document.getElementById("cart-summary");
    container.innerHTML = "";

    if (!cartItems.length) {
      container.innerHTML = `
        <div class="cart-empty">
          <i class="fas fa-shopping-bag"></i>
          <p>No items in your cart</p>
        </div>`;
      summary.style.display = "none";
      return;
    }

    summary.style.display = "flex";
    cartItems.forEach(item => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.dataset.id = item.id;
      row.innerHTML = `
        <div class="item-image">
          <img src="${item.image}" alt="${item.name}"/>
        </div>
        <div class="item-details">
          <span class="item-name">${item.name}</span>
          <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          <div class="item-quantity">
            <button class="qty-btn" data-action="decrease">–</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" data-action="increase">＋</button>
          </div>
        </div>`;
      container.appendChild(row);
    });

    // attach plus/minus
    container.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        const row = e.currentTarget.closest(".cart-item");
        const it  = cartItems.find(i => i.id === row.dataset.id);
        const delta = btn.getAttribute("data-action") === "increase" ? 1 : -1;
        addOrChange(it.id, it.name, it.price, it.image, delta);
      });
    });

    // update total
    const total = cartItems.reduce((sum,i) => sum + i.price * i.quantity, 0);
    document.querySelectorAll(".total-amount").forEach(el => {
      el.textContent = `$${total.toFixed(2)}`;
    });
  }
});
