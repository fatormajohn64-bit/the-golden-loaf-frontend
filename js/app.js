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
     INITIALIZE
  ------------------------------------------------------- */

  async function init() {

    pageContent = document.getElementById("page-content");
    navbarContainer = document.getElementById("navbar");
    footerContainer = document.getElementById("footer");

    if (!pageContent) {
      console.error("App: #page-content was not found.");
      return;
    }

    /*
     * Shared components.
     */

    await loadNavbar();
    await loadFooter();

    /*
     * Router.
     */

    window.addEventListener(
      "hashchange",
      handleRoute
    );

    await handleRoute();
  }

  /* =======================================================
     NAVBAR
  ======================================================= */

  async function loadNavbar() {

    if (!navbarContainer) {
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
          `Navbar HTML failed: ${response.status}`
        );
      }

      navbarContainer.innerHTML =
        await response.text();

      await loadStylesheet(
        "./components/navbar/navbar.css"
      );

      await loadScript(
        "./components/navbar/navbar.js"
      );

      if (
        typeof Navbar !== "undefined" &&
        typeof Navbar.init === "function"
      ) {
        Navbar.init();
      }

    } catch (error) {

      console.error(
        "App: Navbar failed to load.",
        error
      );

      /*
       * Do not destroy the entire application
       * because the navbar has a problem.
       */

      navbarContainer.innerHTML = "";
    }
  }

  /* =======================================================
     FOOTER
  ======================================================= */

  async function loadFooter() {

    if (!footerContainer) {
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
          `Footer HTML failed: ${response.status}`
        );
      }

      footerContainer.innerHTML =
        await response.text();

      await loadStylesheet(
        "./components/footer/footer.css"
      );

      await loadScript(
        "./components/footer/footer.js"
      );

      if (
        typeof Footer !== "undefined" &&
        typeof Footer.init === "function"
      ) {
        Footer.init();
      }

    } catch (error) {

      console.error(
        "App: Footer failed to load.",
        error
      );

      /*
       * Footer failure should not kill the page.
       */

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

    if (!route) {
      route = "home";

      history.replaceState(
        null,
        "",
        "#home"
      );
    }

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

    const pagePath = routes[route];

    if (!pagePath) {
      return;
    }

    /*
     * Fetch the actual page.
     */

    try {

      const response = await fetch(
        pagePath,
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {

        throw new Error(
          `Page HTML failed: ${response.status}`
        );
      }

      const html =
        await response.text();

      /*
       * Insert the page.
       */

      pageContent.innerHTML = html;

      /*
       * Load page CSS.
       *
       * CSS is optional while we are
       * building each page.
       */

      await loadOptionalStylesheet(
        `./pages/${route}/${route}.css`
      );

      /*
       * Load page JS.
       *
       * JS is also optional while a page
       * is being built.
       */

      await loadOptionalScript(
        pageScripts[route]
      );

      /*
       * Update navigation.
       */

      updateNavbar();

      /*
       * Update title.
       */

      document.title =
        getPageTitle(route);

      /*
       * Start at top.
       */

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });

    } catch (error) {

      console.error(
        `App: Failed to load ${route}.`,
        error
      );

      showPageError(
        "We couldn't load this page right now."
      );
    }
  }

  /* =======================================================
     REQUIRED STYLESHEET
  ======================================================= */

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

      link.onload = () => {
        resolve();
      };

      link.onerror = () => {
        reject(
          new Error(
            `Stylesheet failed: ${href}`
          )
        );
      };

      document.head.appendChild(link);
    });
  }

  /* =======================================================
     OPTIONAL STYLESHEET
  ======================================================= */

  function loadOptionalStylesheet(href) {

    return new Promise((resolve) => {

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

        console.warn(
          `App: Optional stylesheet not found: ${href}`
        );

        link.remove();

        resolve();
      };

      document.head.appendChild(link);
    });
  }

  /* =======================================================
     REQUIRED SCRIPT
  ======================================================= */

  function loadScript(src) {

    return new Promise((resolve, reject) => {

      if (!src) {
        resolve();
        return;
      }

      if (loadedScripts.has(src)) {
        resolve();
        return;
      }

      const existing =
        document.querySelector(
          `script[src="${src}"]`
        );

      if (existing) {

        loadedScripts.add(src);

        resolve();

        return;
      }

      const script =
        document.createElement("script");

      script.src = src;
      script.async = false;

      script.onload = () => {

        loadedScripts.add(src);

        resolve();
      };

      script.onerror = () => {

        reject(
          new Error(
            `Script failed: ${src}`
          )
        );
      };

      document.body.appendChild(script);
    });
  }

  /* =======================================================
     OPTIONAL SCRIPT
  ======================================================= */

  function loadOptionalScript(src) {

    return new Promise((resolve) => {

      if (!src) {
        resolve();
        return;
      }

      if (loadedScripts.has(src)) {
        resolve();
        return;
      }

      const existing =
        document.querySelector(
          `script[src="${src}"]`
        );

      if (existing) {

        loadedScripts.add(src);

        resolve();

        return;
      }

      const script =
        document.createElement("script");

      script.src = src;
      script.async = false;

      script.onload = () => {

        loadedScripts.add(src);

        resolve();
      };

      script.onerror = () => {

        console.warn(
          `App: Optional page script not found: ${src}`
        );

        script.remove();

        resolve();
      };

      document.body.appendChild(script);
    });
  }

  /* =======================================================
     NAVBAR UPDATE
  ======================================================= */

  function updateNavbar() {

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

    return titles[route] || titles.home;
  }

  /* =======================================================
     PAGE ERROR
  ======================================================= */

  function showPageError(message) {

    pageContent.innerHTML = `
      <section
        style="
          min-height:60vh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:120px 20px;
          text-align:center;
        "
      >

        <div>

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
