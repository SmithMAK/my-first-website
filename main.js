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
//                    main.js (shared by all product & site pages)
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // 1) Initialize cart count from localStorage (or 0 if none)
  let cartCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
  updateCartBadge(cartCount);

  // 2) Attach event listeners to ALL ".add-to-cart-btn" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      cartCount++;
      localStorage.setItem("cartCount", cartCount);
      updateCartBadge(cartCount);
    });
  });

  // 3) In case a product is already in cart (persist between pages), update badge
  function updateCartBadge(count) {
    const badge = document.querySelector(".cart-count");
    if (badge) {
      badge.textContent = count;
    }
  }
});
