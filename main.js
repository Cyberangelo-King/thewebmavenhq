"use strict";

document.documentElement.classList.add("js");

(function () {
  var nav = document.querySelector(".nav");
  if (!nav) return;

  function setState() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }

  setState();
  window.addEventListener("scroll", setState, { passive: true });
})();

(function () {
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
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

(function () {
  var words = document.querySelectorAll(".word");
  words.forEach(function (word, index) {
    window.setTimeout(function () {
      word.classList.add("in");
    }, 120 + index * 58);
  });
})();

(function () {
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("revealed");
    });
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

(function () {
  var ticker = document.querySelector(".ticker");
  if (!ticker) return;
  ticker.innerHTML += ticker.innerHTML;
})();

(function () {
  var buttons = document.querySelectorAll("[data-filter]");
  var items = document.querySelectorAll("[data-category]");
  if (!buttons.length || !items.length) return;

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");

      buttons.forEach(function (btn) {
        btn.classList.toggle("active", btn === button);
      });

      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !show);
      });
    });
  });
})();

(function () {
  var yearEls = document.querySelectorAll("[data-year]");
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
})();

(function () {
  var themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  var savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  }

  themeToggle.addEventListener("click", function () {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
})();

(function () {
  var body = document.body;
  if (!body) return;
  var rafId;

  body.addEventListener("mousemove", function (e) {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(function () {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      body.style.setProperty("--mouse-x", x + "%");
      body.style.setProperty("--mouse-y", y + "%");
    });
  }, { passive: true });
})();
