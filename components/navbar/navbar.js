/* =========================================================
   THE GOLDEN LOAF BAKERY
   NAVBAR CONTROLLER
========================================================= */

"use strict";

const Navbar = (() => {

  let navbar = null;
  let toggleButton = null;
  let navMenu = null;

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  function init() {
    navbar = document.getElementById("main-navbar");
    toggleButton = document.getElementById("navbar-toggle");
    navMenu = document.getElementById("navbar-nav");

    if (!navbar || !toggleButton || !navMenu) {
      console.warn("Navbar: required elements were not found.");
      return;
    }

    bindEvents();
    updateActiveLink();
  }

  /* -------------------------------------------------------
     EVENTS
  ------------------------------------------------------- */

  function bindEvents() {

    toggleButton.addEventListener("click", toggleMenu);

    navMenu.addEventListener("click", handleNavigation);

    window.addEventListener("hashchange", () => {
      updateActiveLink();
      closeMenu();
    });

    document.addEventListener("click", handleOutsideClick);

    document.addEventListener("keydown", handleKeyboard);
  }

  /* -------------------------------------------------------
     MOBILE MENU
  ------------------------------------------------------- */

  function toggleMenu(event) {
    event.stopPropagation();

    const isOpen =
      toggleButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navMenu.classList.add("is-open");

    toggleButton.setAttribute(
      "aria-expanded",
      "true"
    );

    toggleButton.setAttribute(
      "aria-label",
      "Close navigation menu"
    );
  }

  function closeMenu() {
    if (!navMenu || !toggleButton) {
      return;
    }

    navMenu.classList.remove("is-open");

    toggleButton.setAttribute(
      "aria-expanded",
      "false"
    );

    toggleButton.setAttribute(
      "aria-label",
      "Open navigation menu"
    );
  }

  /* -------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------- */

  function handleNavigation(event) {

    const link = event.target.closest(".nav-link");

    if (!link) {
      return;
    }

    closeMenu();
  }

  /* -------------------------------------------------------
     ACTIVE PAGE
  ------------------------------------------------------- */

  function updateActiveLink() {

    if (!navMenu) {
      return;
    }

    let currentRoute =
      window.location.hash.replace("#", "").trim();

    if (!currentRoute) {
      currentRoute = "home";
    }

    const links =
      navMenu.querySelectorAll(".nav-link");

    links.forEach((link) => {

      const route =
        link.dataset.route;

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
     OUTSIDE CLICK
  ------------------------------------------------------- */

  function handleOutsideClick(event) {

    if (!navMenu.classList.contains("is-open")) {
      return;
    }

    const clickedInsideNavbar =
      navbar.contains(event.target);

    if (!clickedInsideNavbar) {
      closeMenu();
    }
  }

  /* -------------------------------------------------------
     KEYBOARD
  ------------------------------------------------------- */

  function handleKeyboard(event) {

    if (event.key === "Escape") {
      closeMenu();
    }
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  return {
    init,
    openMenu,
    closeMenu,
    updateActiveLink
  };

})();
