/* =========================================================
   THE GOLDEN LOAF BAKERY
   APPLICATION ROUTER
========================================================= */

"use strict";

const App = (() => {

  const routes = {
    home: "./pages/home/home.html",
    shop: "./pages/shop/shop.html",
    about: "./pages/about/about.html",
    contact: "./pages/contact/contact.html"
  };

  const pageScripts = {
    home: "./pages/home/home.js",
    shop: "./pages/shop/shop.js",
    about: "./pages/about/about.js",
    contact: "./pages/contact/contact.js"
  };

  let pageContent = null;
  let navbarContainer = null;
  let loadedScripts = new Set();

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  async function init() {

    pageContent = document.getElementById("page-content");
    navbarContainer = document.getElementById("navbar");

    if (!pageContent) {
      console.error("App: #page-content was not found.");
      return;
    }

    await loadNavbar();

    window.addEventListener(
      "hashchange",
      handleRoute
    );

    await handleRoute();
  }

  /* -------------------------------------------------------
     LOAD NAVBAR
  ------------------------------------------------------- */

  async function loadNavbar() {

    if (!navbarContainer) {
      console.warn(
        "App: #navbar container was not found."
      );
      return;
    }

    try {

      const response = await fetch(
        "./components/navbar/navbar.html",
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {
        throw new Error(
          `Navbar request failed: ${response.status}`
        );
      }

      navbarContainer.innerHTML =
        await response.text();

      await loadStylesheet(
        "./components/navbar/navbar.css"
      );

      loadScript(
        "./components/navbar/navbar.js",
        () => {
          if (
            typeof Navbar !== "undefined" &&
            typeof Navbar.init === "function"
          ) {
            Navbar.init();
          }
        }
      );

    } catch (error) {

      console.error(
        "App: Failed to load navbar.",
        error
      );

      navbarContainer.innerHTML = "";
    }
  }

  /* -------------------------------------------------------
     ROUTING
  ------------------------------------------------------- */

  async function handleRoute() {

    let route =
      window.location.hash
        .replace("#", "")
        .trim()
        .toLowerCase();

    if (!route) {
      route = "home";

      if (
        window.location.hash !== "#home"
      ) {
        history.replaceState(
          null,
          "",
          "#home"
        );
      }
    }

    if (!routes[route]) {
      route = "home";
    }

    await loadPage(route);
  }

  /* -------------------------------------------------------
     LOAD PAGE
  ------------------------------------------------------- */

  async function loadPage(route) {

    const pagePath = routes[route];

    if (!pagePath) {
      showError(
        "Page not found."
      );
      return;
    }

    showLoading();

    try {

      const response = await fetch(
        pagePath,
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {
        throw new Error(
          `Page request failed: ${response.status}`
        );
      }

      pageContent.innerHTML =
        await response.text();

      await loadPageStyles(route);

      await loadPageScript(route);

      updateNavbar(route);

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

    } catch (error) {

      console.error(
        `App: Failed to load ${route} page.`,
        error
      );

      showError(
        "We couldn't load this page right now. Please try again."
      );
    }
  }

  /* -------------------------------------------------------
     PAGE STYLES
  ------------------------------------------------------- */

  async function loadPageStyles(route) {

    const stylesheet =
      `./pages/${route}/${route}.css`;

    try {
      await loadStylesheet(stylesheet);
    } catch (error) {
      console.warn(
        `App: No stylesheet found for ${route}.`,
        error
      );
    }
  }

  /* -------------------------------------------------------
     PAGE SCRIPT
  ------------------------------------------------------- */

  function loadPageScript(route) {

    const script =
      pageScripts[route];

    if (!script) {
      return Promise.resolve();
    }

    if (loadedScripts.has(script)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {

      const scriptElement =
        document.createElement("script");

      scriptElement.src = script;
      scriptElement.async = false;

      scriptElement.onload = () => {
        loadedScripts.add(script);
        resolve();
      };

      scriptElement.onerror = () => {
        reject(
          new Error(
            `Failed to load script: ${script}`
          )
        );
      };

      document.body.appendChild(
        scriptElement
      );
    });
  }

  /* -------------------------------------------------------
     STYLESHEET LOADER
  ------------------------------------------------------- */

  function loadStylesheet(href) {

    return new Promise((resolve, reject) => {

      const existing =
        document.querySelector(
          `link[href="${href}"]`
        );

      if (existing) {
        resolve();
        return;
      }

      const link =
        document.createElement("link");

      link.rel = "stylesheet";
      link.href = href;

      link.onload = resolve;

      link.onerror = () => {
        reject(
          new Error(
            `Failed to load stylesheet: ${href}`
          )
        );
      };

      document.head.appendChild(link);
    });
  }

  /* -------------------------------------------------------
     NAVBAR UPDATE
  ------------------------------------------------------- */

  function updateNavbar(route) {

    if (
      typeof Navbar !== "undefined" &&
      typeof Navbar.updateActiveLink === "function"
    ) {
      Navbar.updateActiveLink();
    }

    document.title =
      getPageTitle(route);
  }

  /* -------------------------------------------------------
     PAGE TITLES
  ------------------------------------------------------- */

  function getPageTitle(route) {

    const titles = {
      home: "The Golden Loaf Bakery",
      shop: "Shop | The Golden Loaf Bakery",
      about: "About Us | The Golden Loaf Bakery",
      contact: "Contact | The Golden Loaf Bakery"
    };

    return (
      titles[route] ||
      titles.home
    );
  }

  /* -------------------------------------------------------
     LOADING STATE
  ------------------------------------------------------- */

  function showLoading() {

    pageContent.innerHTML = `
      <div class="app-loading" aria-live="polite">
        <div class="app-loading-mark">GL</div>
        <span>Loading...</span>
      </div>
    `;
  }

  /* -------------------------------------------------------
     ERROR STATE
  ------------------------------------------------------- */

  function showError(message) {

    pageContent.innerHTML = `
      <section class="app-error" role="alert">
        <div class="app-error-card">
          <span class="app-error-mark">GL</span>

          <h1>Something went wrong</h1>

          <p>${message}</p>

          <button
            type="button"
            onclick="location.reload()"
          >
            Try Again
          </button>
        </div>
      </section>
    `;
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  return {
    init,
    handleRoute
  };

})();

/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => App.init()
);
