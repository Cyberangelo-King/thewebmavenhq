"use strict";

document.documentElement.classList.add("js");

/* ─── NAV SCROLL STATE ────────────────────────────────────────────────────── */
(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  function setState() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }

  setState();
  window.addEventListener("scroll", setState, { passive: true });
})();

/* ─── MOBILE MENU TOGGLE ──────────────────────────────────────────────────── */
(function () {
  var toggle = document.querySelector(".nav__toggle");
  var links  = document.querySelector(".nav__links");
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });
})();

/* ─── HERO WORD ANIMATION ────────────────────────────────────────────────────── */
(function () {
  var words = document.querySelectorAll(".word");
  words.forEach(function (word, index) {
    window.setTimeout(function () {
      word.classList.add("in");
    }, 120 + index * 58);
  });
})();

/* ─── SCROLL REVEAL ─────────────────────────────────────────────────────── */
(function () {
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("revealed"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -70px 0px" });

  revealEls.forEach(function (el) {
    var delay = el.getAttribute("data-delay");
    if (delay) el.style.setProperty("--delay", delay + "ms");
    observer.observe(el);
  });
})();

/* ─── TICKER DUPLICATION ────────────────────────────────────────────────────── */
(function () {
  var ticker = document.querySelector(".ticker");
  if (!ticker) return;
  ticker.innerHTML += ticker.innerHTML;
})();

/* ─── PORTFOLIO FILTER ─────────────────────────────────────────────────────── */
(function () {
  var buttons = document.querySelectorAll("[data-filter]");
  var items   = document.querySelectorAll("[data-category]");
  if (!buttons.length || !items.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      buttons.forEach(function (btn) {
        btn.classList.toggle("active", btn === button);
        btn.setAttribute("aria-pressed", btn === button ? "true" : "false");
      });

      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });

  // Set initial aria-pressed
  buttons.forEach(function (btn) {
    btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");
  });
})();

/* ─── YEAR FILL ─────────────────────────────────────────────────────────── */
(function () {
  var yearEls = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) { el.textContent = year; });
})();

/* ─── THEME TOGGLE ─────────────────────────────────────────────────────── */
(function () {
  var themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }

  themeToggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
  });
})();

/* ─── MOUSE PARALLAX ────────────────────────────────────────────────────── */
(function () {
  var body = document.body;
  if (!body) return;
  var rafId;

  body.addEventListener("mousemove", function (e) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      var x = (e.clientX / window.innerWidth)  * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      body.style.setProperty("--mouse-x", x + "%");
      body.style.setProperty("--mouse-y", y + "%");
    });
  }, { passive: true });
})();

/* ─── CONTACT FORM ─────────────────────────────────────────────────────── */
(function () {
  var form      = document.getElementById("contact-form");
  var success   = document.getElementById("form-success");
  var submitBtn = document.getElementById("submit-btn");
  if (!form) return;

  var endpoint = form.getAttribute("data-formspree") || form.getAttribute("action");

  /* Inline validation helpers */
  function validateField(input) {
    var valid = input.checkValidity();
    input.classList.toggle("error", !valid);
    return valid;
  }

  /* Validate on blur */
  form.querySelectorAll("input, textarea, select").forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
    /* Clear error on input */
    field.addEventListener("input", function () {
      if (field.classList.contains("error")) validateField(field);
    });
  });

  /* Helper: inline error message */
  function clearSubmitError() {
    var existing = form.querySelector(".form-submit-error");
    if (existing) existing.remove();
  }
  function showSubmitError() {
    clearSubmitError();
    var err = document.createElement("p");
    err.className = "form-submit-error";
    err.setAttribute("role", "alert");
    err.style.cssText = "margin-top:12px;color:#ef4444;font-size:14px;";
    err.textContent = "Something went wrong \u2014 try WhatsApp or email directly.";
    form.insertAdjacentElement("afterend", err);
  }

  /* Submit via AJAX fetch \u2014 user never leaves the page */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = form.querySelectorAll("input[required], textarea[required], select[required]");
    var allValid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      var firstError = form.querySelector(".error");
      if (firstError) firstError.focus();
      return;
    }

    clearSubmitError();

    /* Loading state */
    var label   = submitBtn ? submitBtn.querySelector(".submit-label")   : null;
    var loading = submitBtn ? submitBtn.querySelector(".submit-loading") : null;
    if (submitBtn) submitBtn.disabled = true;
    if (label)   label.style.display   = "none";
    if (loading) loading.style.display = "inline";

    fetch(endpoint, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
    .then(function (response) {
      if (response.ok) {
        /* Success: hide form, show confirmation */
        form.style.display = "none";
        if (success) success.classList.add("visible");
      } else {
        showSubmitError();
        if (submitBtn) submitBtn.disabled = false;
        if (label)   label.style.display   = "";
        if (loading) loading.style.display = "none";
      }
    })
    ["catch"](function () {
      showSubmitError();
      if (submitBtn) submitBtn.disabled = false;
      if (label)   label.style.display   = "";
      if (loading) loading.style.display = "none";
    });
  });
})();
