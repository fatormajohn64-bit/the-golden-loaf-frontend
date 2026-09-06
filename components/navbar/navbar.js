/* =========================================================
   THE GOLDEN LOAF BAKERY
   NAVBAR CONTROLLER
========================================================= */

"use strict";

const Navbar = (() => {

  let navbar = null;
  let navLinks = [];

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  function init() {

    navbar =
      document.getElementById("main-navbar");

    if (!navbar) {
      console.warn(
        "Navbar: #main-navbar was not found."
      );
      return;
    }

    navLinks = [
      ...navbar.querySelectorAll(".nav-link")
    ];

    bindEvents();
    updateActiveLink();
  }

  /* -------------------------------------------------------
     EVENTS
  ------------------------------------------------------- */

  function bindEvents() {

    /*
     * Update active navigation when
     * the URL hash changes.
     */

    window.addEventListener(
      "hashchange",
      updateActiveLink
    );

    /*
     * Close/update state immediately
     * when a navigation link is clicked.
     */

    navLinks.forEach((link) => {

      link.addEventListener(
        "click",
        handleNavigation
      );

    });
  }

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function handleNavigation() {

    /*
     * Give the browser a moment to update
     * the hash before checking the route.
     */

    requestAnimationFrame(() => {
      updateActiveLink();
    });
  }

  /* -------------------------------------------------------
     ACTIVE LINK
  ------------------------------------------------------- */

  function updateActiveLink() {

    if (!navbar) {
      return;
    }

    let currentRoute =
      window.location.hash
        .replace("#", "")
        .trim()
        .toLowerCase();

    /*
     * Default route.
     */

    if (!currentRoute) {
      currentRoute = "home";
    }

    navLinks.forEach((link) => {

      const route =
        (link.dataset.route || "")
          .trim()
          .toLowerCase();

      const isActive =
        route === currentRoute;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  return {

    init,

    updateActiveLink

  };

})();
