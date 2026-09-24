/* ===== MG S5 EV — Search (Pagefind) integration ===== */
(function () {
  "use strict";

  // Load Pagefind UI lib uri-relative (works on subpages)
  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = cb || (function () {});
    document.head.appendChild(s);
  }
  function loadCss(href) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    document.head.appendChild(l);
  }

  function initUi() {
    if (!window.PagefindUI) return;
    var base = {
      showSubResults: true,
      showImages: false,
      noWorker: true,
      translations: { clear_search: "Bersihkan", clear_filters: "Bersihkan", show_more: "Muat lebih", show_less: "Sembunyikan" }
    };
    // 1) Kotak besar di halaman utama (#hero-search)
    var heroBox = document.getElementById("hero-search");
    if (heroBox) {
      new PagefindUI(Object.assign({}, base, { element: "#hero-search" }));
    }
    // 2) Modal dari navbar (#search-modal-panel)
    var modalBox = document.getElementById("search-modal-panel");
    if (modalBox && !modalBox.dataset.init) {
      modalBox.dataset.init = "1";
      new PagefindUI(Object.assign({}, base, { element: "#search-modal-panel" }));
    }
    wireModal();
  }

  function wireModal() {
    var openers = document.querySelectorAll("[data-search-open]");
    var modal = document.getElementById("search-modal");
    var close = document.getElementById("search-modal-close");
    if (!modal) return;

    var lastTrigger = null;
    function open(trigger) {
      lastTrigger = trigger || null;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      var input = modal.querySelector(".pagefind-ui__search-input");
      if (input) setTimeout(function () { input.focus(); }, 60);
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
      lastTrigger = null;
    }

    openers.forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
      b.addEventListener("click", function (e) {
        e.preventDefault();
        b.setAttribute("aria-expanded", "true");
        open(b);
      });
    });
    if (close) close.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) {
        openers.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
        closeModal();
      }
      if (e.key === "Tab" && modal.classList.contains("open")) {
        var focusables = modal.querySelectorAll("button, a[href], input, [tabindex]:not([tabindex='-1'])");
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
    openers.forEach(function (b) {
      b.addEventListener("click", function () {
        var menu = document.querySelector(".nav-menu.open");
        if (menu) { menu.classList.remove("open"); }
        var navBtn = document.querySelector(".nav-toggle[aria-expanded='true']");
        if (navBtn) navBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Load assets then boot
  loadCss("pagefind/pagefind-ui.css");
  loadCss("search.css");
  loadScript("pagefind/pagefind-ui.js", initUi);

  // Ensure modal wired even if PagefindUI delayed
  window.addEventListener("DOMContentLoaded", function () {
    setTimeout(wireModal, 0);
  });
})();
