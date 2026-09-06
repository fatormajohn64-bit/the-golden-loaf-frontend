/* =========================================================
   THE GOLDEN LOAF BAKERY
   FOOTER CONTROLLER
========================================================= */

"use strict";

const Footer = (() => {

  /* -------------------------------------------------------
     INITIALIZE
  ------------------------------------------------------- */

  function init() {

    setCopyrightYear();
    bindContactLinks();
    bindSocialLinks();
  }

  /* -------------------------------------------------------
     COPYRIGHT
  ------------------------------------------------------- */

  function setCopyrightYear() {

    const yearElement =
      document.getElementById("footer-year");

    if (!yearElement) {
      return;
    }

    yearElement.textContent =
      new Date().getFullYear();
  }

  /* -------------------------------------------------------
     CONTACT LINKS
  ------------------------------------------------------- */

  function bindContactLinks() {

    if (typeof CONFIG === "undefined") {
      console.warn(
        "Footer: CONFIG is not available."
      );
      return;
    }

    const email =
      document.getElementById("footer-email");

    const phone =
      document.getElementById("footer-phone");

    const whatsapp =
      document.getElementById("footer-whatsapp");

    /* Email */

    if (email && CONFIG.EMAIL) {

      email.href =
        `mailto:${CONFIG.EMAIL}`;

      email.textContent =
        CONFIG.EMAIL;
    }

    /* Phone */

    if (phone && CONFIG.PHONE_NUMBER) {

      const phoneValue =
        CONFIG.PHONE_NUMBER;

      phone.href =
        `tel:${phoneValue.replace(/[^\d+]/g, "")}`;

      phone.textContent =
        phoneValue;
    }

    /* WhatsApp */

    if (whatsapp && CONFIG.WHATSAPP_NUMBER) {

      const whatsappNumber =
        CONFIG.WHATSAPP_NUMBER.replace(/\D/g, "");

      whatsapp.href =
        `https://wa.me/${whatsappNumber}`;

      whatsapp.target = "_blank";
      whatsapp.rel =
        "noopener noreferrer";

      whatsapp.textContent =
        "WhatsApp";
    }
  }

  /* -------------------------------------------------------
     SOCIAL LINKS
  ------------------------------------------------------- */

  function bindSocialLinks() {

    if (typeof CONFIG === "undefined") {
      return;
    }

    const facebook =
      document.getElementById("footer-facebook");

    const instagram =
      document.getElementById("footer-instagram");

    const tiktok =
      document.getElementById("footer-tiktok");

    setSocialLink(
      facebook,
      CONFIG.FACEBOOK_URL
    );

    setSocialLink(
      instagram,
      CONFIG.INSTAGRAM_URL
    );

    setSocialLink(
      tiktok,
      CONFIG.TIKTOK_URL
    );
  }

  /* -------------------------------------------------------
     SOCIAL LINK HELPER
  ------------------------------------------------------- */

  function setSocialLink(element, url) {

    if (!element) {
      return;
    }

    if (!url) {

      element.style.display = "none";

      return;
    }

    element.href = url;

    element.target = "_blank";

    element.rel =
      "noopener noreferrer";

    element.style.display = "inline-block";
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  return {
    init
  };

})();
