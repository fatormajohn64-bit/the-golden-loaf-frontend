/* =========================================================
   THE GOLDEN LOAF BAKERY
   APPLICATION CONTROLLER
   ========================================================= */

"use strict";

const App = {

  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  currentRoute: null,

  routes: {
    home: "./pages/home/home.html",
    shop: "./pages/shop/shop.html",
    about: "./pages/about/about.html",
    contact: "./pages/contact/contact.html"
  },


  /* -------------------------------------------------------
     START APPLICATION
  ------------------------------------------------------- */

  async init() {
    this.bindEvents();

    await this.handleRoute();
  },


  /* -------------------------------------------------------
     ROUTER EVENTS
  ------------------------------------------------------- */

  bindEvents() {
    window.addEventListener("hashchange", () => {
      this.handleRoute();
    });
  },


  /* -------------------------------------------------------
     ROUTE HANDLER
  ------------------------------------------------------- */

  async handleRoute() {
    const hash = window.location.hash.replace("#", "");

    const route = hash || "home";

    await this.loadPage(route);
  },


  /* -------------------------------------------------------
     LOAD PAGE
  ------------------------------------------------------- */

  async loadPage(route) {

    const pageContent = document.getElementById("page-content");

    if (!pageContent) {
      console.error("App: #page-content was not found.");
      return;
    }

    const pagePath = this.routes[route];

    if (!pagePath) {
      await this.loadPage("home");
      return;
    }

    try {

      pageContent.classList.add("page-loading");

      const response = await fetch(pagePath, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load page: ${response.status}`
        );
      }

      const html = await response.text();

      pageContent.innerHTML = html;

      this.currentRoute = route;

      await this.loadPageAssets(route);

      window.scrollTo({
        top: 0,
        behavior: "instant"
      });

    } catch (error) {

      console.error("App: Page loading failed.", error);

      pageContent.innerHTML = `
        <section class="app-error">
          <div class="container">
            <h1>Something went wrong</h1>
            <p>
              We couldn't load this page right now.
              Please try again.
            </p>

            <a href="#home">
              Return Home
            </a>
          </div>
        </section>
      `;

    } finally {

      pageContent.classList.remove("page-loading");

    }
  },


  /* -------------------------------------------------------
     PAGE ASSETS
  ------------------------------------------------------- */

  async loadPageAssets(route) {

    /*
      Each page will eventually load its own JavaScript
      and CSS.

      Example:

      Home
        home.css
        home.js

      Shop
        shop.css
        shop.js

      About
        about.css
        about.js

      Contact
        contact.css
        contact.js

      We keep this separate so the application does not
      become one huge JavaScript file.
    */

    if (route === "home") {
      await this.loadScript("./pages/home/home.js");
      return;
    }

    if (route === "shop") {
      await this.loadScript("./pages/shop/shop.js");
      return;
    }

    if (route === "about") {
      await this.loadScript("./pages/about/about.js");
      return;
    }

    if (route === "contact") {
      await this.loadScript("./pages/contact/contact.js");
    }
  },


  /* -------------------------------------------------------
     SCRIPT LOADER
  ------------------------------------------------------- */

  loadScript(src) {

    return new Promise((resolve, reject) => {

      const existingScript = document.querySelector(
        `script[data-page-script="${src}"]`
      );

      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");

      script.src = src;
      script.dataset.pageScript = src;

      script.onload = () => resolve();

      script.onerror = () => {
        reject(
          new Error(`Unable to load script: ${src}`)
        );
      };

      document.body.appendChild(script);

    });

  }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
