/* =========================================================
   THE GOLDEN LOAF BAKERY
   APPLICATION CONTROLLER / ROUTER
========================================================= */

"use strict";

const App = (() => {

  /* -------------------------------------------------------
     ROUTES
  ------------------------------------------------------- */

  const routes = {
    home: "./pages/home/home.html",
    shop: "./pages/shop/shop.html",
    about: "./pages/about/about.html",
    contact: "./pages/contact/contact.html"
  };

  /* -------------------------------------------------------
     PAGE SCRIPTS
  ------------------------------------------------------- */

  const pageScripts = {
    home: "./pages/home/home.js",
    shop: "./pages/shop/shop.js",
    about: "./pages/about/about.js",
    contact: "./pages/contact/contact.js"
  };

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  let pageContent = null;
  let navbarContainer = null;
  let footerContainer = null;

  const loadedScripts = new Set();

  /* -------------------------------------------------------
     INITIALIZE APPLICATION
  ------------------------------------------------------- */

  async function init() {

    pageContent =
      document.getElementById("page-content");

    navbarContainer =
      document.getElementById("navbar");

    footerContainer =
      document.getElementById("footer");

    if (!pageContent) {

      console.error(
        "App: #page-content was not found."
      );

      return;
    }

    /*
     * Load shared components first.
     */

    await loadNavbar();
    await loadFooter();

    /*
     * Listen for route changes.
     */

    window.addEventListener(
      "hashchange",
      handleRoute
    );

    /*
     * Load initial page.
     */

    await handleRoute();
  }

  /* =======================================================
     NAVBAR
  ======================================================= */

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

      /*
       * Load navbar CSS.
       */

      await loadStylesheet(
        "./components/navbar/navbar.css"
      );

      /*
       * Load navbar JavaScript.
       */

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

  /* =======================================================
     FOOTER
  ======================================================= */

  async function loadFooter() {

    if (!footerContainer) {

      console.warn(
        "App: #footer container was not found."
      );

      return;
    }

    try {

      const response = await fetch(
        "./components/footer/footer.html",
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {

        throw new Error(
          `Footer request failed: ${response.status}`
        );
      }

      footerContainer.innerHTML =
        await response.text();

      /*
       * Load footer CSS.
       */

      await loadStylesheet(
        "./components/footer/footer.css"
      );

      /*
       * Load footer JavaScript.
       */

      loadScript(
        "./components/footer/footer.js",
        () => {

          if (
            typeof Footer !== "undefined" &&
            typeof Footer.init === "function"
          ) {

            Footer.init();
          }

        }
      );

    } catch (error) {

      console.error(
        "App: Failed to load footer.",
        error
      );

      footerContainer.innerHTML = "";
    }
  }

  /* =======================================================
     ROUTER
  ======================================================= */

  async function handleRoute() {

    let route =
      window.location.hash
        .replace("#", "")
        .trim()
        .toLowerCase();

    /*
     * No hash = Home.
     */

    if (!route) {

      route = "home";

      history.replaceState(
        null,
        "",
        "#home"
      );
    }

    /*
     * Unknown route = Home.
     */

    if (!routes[route]) {

      route = "home";

      history.replaceState(
        null,
        "",
        "#home"
      );
    }

    await loadPage(route);
  }

  /* =======================================================
     LOAD PAGE
  ======================================================= */

  async function loadPage(route) {

    const pagePath =
      routes[route];

    if (!pagePath) {

      showError(
        "The requested page could not be found."
      );

      return;
    }

    showLoading();

    try {

      /*
       * Fetch page HTML.
       */

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

      /*
       * Insert page HTML.
       */

      pageContent.innerHTML =
        await response.text();

      /*
       * Load page-specific CSS.
       */

      await loadPageStyles(route);

      /*
       * Load page-specific JavaScript.
       */

      await loadPageScript(route);

      /*
       * Update navbar.
       */

      updateNavbar(route);

      /*
       * Update document title.
       */

      document.title =
        getPageTitle(route);

      /*
       * Scroll page to top.
       */

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

  /* =======================================================
     PAGE CSS
  ======================================================= */

  async function loadPageStyles(route) {

    const stylesheet =
      `./pages/${route}/${route}.css`;

    try {

      await loadStylesheet(
        stylesheet
      );

    } catch (error) {

      /*
       * CSS is optional while a page
       * is still being built.
       */

      console.warn(
        `App: No stylesheet found for ${route}.`,
        error
      );
    }
  }

  /* =======================================================
     PAGE JAVASCRIPT
  ======================================================= */

  function loadPageScript(route) {

    const script =
      pageScripts[route];

    if (!script) {

      return Promise.resolve();
    }

    /*
     * Don't load the same script twice.
     */

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

  /* =======================================================
     GENERIC SCRIPT LOADER
  ======================================================= */

  function loadScript(src, callback) {

    const existing =
      document.querySelector(
        `script[src="${src}"]`
      );

    /*
     * Already loaded.
     */

    if (existing) {

      if (callback) {
        callback();
      }

      return;
    }

    const script =
      document.createElement("script");

    script.src = src;

    script.async = false;

    script.onload = () => {

      if (callback) {
        callback();
      }
    };

    script.onerror = () => {

      console.error(
        `App: Failed to load script: ${src}`
      );
    };

    document.body.appendChild(
      script
    );
  }

  /* =======================================================
     STYLESHEET LOADER
  ======================================================= */

  function loadStylesheet(href) {

    return new Promise((resolve, reject) => {

      /*
       * Prevent duplicate stylesheets.
       */

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

      link.onload = () => {
        resolve();
      };

      link.onerror = () => {

        reject(
          new Error(
            `Failed to load stylesheet: ${href}`
          )
        );
      };

      document.head.appendChild(
        link
      );
    });
  }

  /* =======================================================
     UPDATE NAVBAR
  ======================================================= */

  function updateNavbar(route) {

    if (
      typeof Navbar !== "undefined" &&
      typeof Navbar.updateActiveLink === "function"
    ) {

      Navbar.updateActiveLink();
    }
  }

  /* =======================================================
     PAGE TITLES
  ======================================================= */

  function getPageTitle(route) {

    const titles = {

      home:
        "The Golden Loaf Bakery",

      shop:
        "Shop | The Golden Loaf Bakery",

      about:
        "About Us | The Golden Loaf Bakery",

      contact:
        "Contact | The Golden Loaf Bakery"
    };

    return (
      titles[route] ||
      titles.home
    );
  }

  /* =======================================================
     LOADING STATE
  ======================================================= */

  function showLoading() {

    pageContent.innerHTML = `

      <div
        class="app-loading"
        aria-live="polite"
      >

        <div class="app-loading-mark">
          GL
        </div>

        <span>
          Loading...
        </span>

      </div>
    `;
  }

  /* =======================================================
     ERROR STATE
  ======================================================= */

  function showError(message) {

    pageContent.innerHTML = `

      <section
        class="app-error"
        role="alert"
      >

        <div class="app-error-card">

          <span class="app-error-mark">
            GL
          </span>

          <h1>
            Something went wrong
          </h1>

          <p>
            ${message}
          </p>

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

  /* =======================================================
     PUBLIC API
  ======================================================= */

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
  () => {

    App.init();

  }
);
