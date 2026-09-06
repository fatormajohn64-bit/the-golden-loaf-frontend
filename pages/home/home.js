/* =========================================================
   THE GOLDEN LOAF BAKERY
   HOME PAGE CONTROLLER
========================================================= */

"use strict";

const HomePage = (() => {

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  let initialized = false;
  let productsContainer = null;


  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  function init() {

    if (initialized) {
      return;
    }

    initialized = true;

    productsContainer =
      document.getElementById("home-best-sellers");

    bindNavigation();

    loadBestSellers();
  }


  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function bindNavigation() {

    const links =
      document.querySelectorAll(
        ".home-nav-link"
      );

    links.forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          const route =
            link.getAttribute("href");

          if (!route) {
            return;
          }

          updateActiveNavigation(route);
        }
      );

    });

  }


  /* -------------------------------------------------------
     ACTIVE NAVIGATION
  ------------------------------------------------------- */

  function updateActiveNavigation(route) {

    const links =
      document.querySelectorAll(
        ".home-nav-link"
      );

    links.forEach((link) => {

      const linkRoute =
        link.getAttribute("href");

      link.classList.toggle(
        "active",
        linkRoute === route
      );

    });

  }


  /* -------------------------------------------------------
     LOAD BEST SELLERS
  ------------------------------------------------------- */

  async function loadBestSellers() {

    if (!productsContainer) {
      return;
    }

    /*
     * The backend has not been connected yet.
     *
     * We intentionally DO NOT create demo products.
     */

    if (
      typeof CONFIG === "undefined" ||
      !CONFIG.API_URL
    ) {

      showProductsEmptyState(
        "Our fresh selection will appear here soon."
      );

      return;
    }


    try {

      showProductsLoading();


      const response =
        await fetch(
          CONFIG.API_URL,
          {
            method: "GET",
            headers: {
              "Accept": "application/json"
            },
            cache: "no-cache"
          }
        );


      if (!response.ok) {

        throw new Error(
          `Products request failed: ${response.status}`
        );

      }


      const data =
        await response.json();


      const products =
        normalizeProducts(data);


      if (!products.length) {

        showProductsEmptyState(
          "No products are available right now."
        );

        return;
      }


      renderProducts(products);

    } catch (error) {

      console.error(
        "HomePage: Failed to load products.",
        error
      );


      showProductsEmptyState(
        "We couldn't load our fresh selection right now."
      );

    }

  }


  /* -------------------------------------------------------
     NORMALIZE API RESPONSE
  ------------------------------------------------------- */

  function normalizeProducts(data) {

    /*
     * Supports common API response formats
     * without creating any fallback data.
     */

    if (Array.isArray(data)) {
      return data;
    }

    if (
      data &&
      Array.isArray(data.products)
    ) {
      return data.products;
    }

    if (
      data &&
      data.data &&
      Array.isArray(data.data)
    ) {
      return data.data;
    }

    if (
      data &&
      data.data &&
      Array.isArray(data.data.products)
    ) {
      return data.data.products;
    }

    return [];

  }


  /* -------------------------------------------------------
     RENDER PRODUCTS
  ------------------------------------------------------- */

  function renderProducts(products) {

    if (!productsContainer) {
      return;
    }


    /*
     * Home only shows a small selection.
     *
     * The products themselves still come
     * completely from the backend.
     */

    const bestSellers =
      products
        .filter((product) => {

          return (
            product &&
            (
              product.bestSeller === true ||
              product.isBestSeller === true ||
              product.featured === true
            )
          );

        })
        .slice(0, 5);


    /*
     * If the API returned products but none
     * are marked as best sellers, show the
     * first five real products.
     */

    const displayProducts =
      bestSellers.length
        ? bestSellers
        : products.slice(0, 5);


    if (!displayProducts.length) {

      showProductsEmptyState(
        "No products are available right now."
      );

      return;
    }


    productsContainer.innerHTML =
      displayProducts
        .map(
          (product) =>
            createProductCard(product)
        )
        .join("");

  }


  /* -------------------------------------------------------
     PRODUCT CARD
  ------------------------------------------------------- */

  function createProductCard(product) {

    const id =
      escapeHTML(
        product.id ??
        product._id ??
        ""
      );


    const name =
      escapeHTML(
        product.name ??
        product.title ??
        "Bakery Product"
      );


    const description =
      escapeHTML(
        product.description ??
        ""
      );


    const image =
      getProductImage(product);


    const price =
      formatPrice(
        product.price
      );


    const badge =
      getProductBadge(product);


    return `

      <article
        class="home-product-card"
        data-product-id="${id}"
      >

        <div class="home-product-image">

          ${
            image
              ? `
                <img
                  src="${escapeAttribute(image)}"
                  alt="${escapeAttribute(name)}"
                  loading="lazy"
                >
              `
              : `
                <div class="home-product-no-image">
                  NO IMAGE
                </div>
              `
          }

          ${
            badge
              ? `
                <span class="home-product-badge">
                  ${escapeHTML(badge)}
                </span>
              `
              : ""
          }

        </div>


        <div class="home-product-content">

          <h3>
            ${name}
          </h3>

          ${
            description
              ? `
                <p>
                  ${description}
                </p>
              `
              : ""
          }


          <div class="home-product-bottom">

            <span class="home-product-price">
              ${price}
            </span>

            <button
              type="button"
              class="home-product-cart"
              data-product-id="${id}"
              aria-label="Add ${escapeAttribute(name)} to cart"
            >
              +
            </button>

          </div>

        </div>

      </article>

    `;

  }


  /* -------------------------------------------------------
     PRODUCT IMAGE
  ------------------------------------------------------- */

  function getProductImage(product) {

    if (!product) {
      return "";
    }

    return (
      product.image ||
      product.imageUrl ||
      product.imageURL ||
      product.thumbnail ||
      ""
    );

  }


  /* -------------------------------------------------------
     PRODUCT BADGE
  ------------------------------------------------------- */

  function getProductBadge(product) {

    if (!product) {
      return "";
    }

    if (
      product.badge &&
      typeof product.badge === "string"
    ) {
      return product.badge;
    }

    if (product.isNew === true) {
      return "NEW";
    }

    if (
      product.bestSeller === true ||
      product.isBestSeller === true
    ) {
      return "BEST SELLER";
    }

    return "";

  }


  /* -------------------------------------------------------
     PRICE FORMAT
  ------------------------------------------------------- */

  function formatPrice(price) {

    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "Price unavailable";
    }


    const numericPrice =
      Number(price);


    if (
      Number.isNaN(numericPrice)
    ) {
      return escapeHTML(
        String(price)
      );
    }


    const currency =
      (
        typeof CONFIG !== "undefined" &&
        CONFIG.CURRENCY
      )
        ? CONFIG.CURRENCY
        : "Le";


    return `${currency} ${numericPrice.toLocaleString()}`;

  }


  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  function showProductsLoading() {

    if (!productsContainer) {
      return;
    }

    productsContainer.innerHTML = `

      <div class="home-products-state">

        <span class="home-products-loader"></span>

        <p>
          Loading fresh products...
        </p>

      </div>

    `;

  }


  /* -------------------------------------------------------
     EMPTY / ERROR STATE
  ------------------------------------------------------- */

  function showProductsEmptyState(message) {

    if (!productsContainer) {
      return;
    }

    productsContainer.innerHTML = `

      <div class="home-products-state">

        <div class="home-products-state-mark">
          GL
        </div>

        <p>
          ${escapeHTML(message)}
        </p>

        <a href="#shop">
          VISIT SHOP →
        </a>

      </div>

    `;

  }


  /* -------------------------------------------------------
     HTML ESCAPE
  ------------------------------------------------------- */

  function escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  /* -------------------------------------------------------
     ATTRIBUTE ESCAPE
  ------------------------------------------------------- */

  function escapeAttribute(value) {

    return escapeHTML(value);

  }


  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  return {

    init

  };

})();


/* =========================================================
   START HOME PAGE
========================================================= */

if (
  typeof HomePage !== "undefined" &&
  typeof HomePage.init === "function"
) {

  HomePage.init();
}
