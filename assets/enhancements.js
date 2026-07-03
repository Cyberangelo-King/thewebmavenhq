'use strict';

/**
 * The Web Maven — enhancements.js
 * Phase 2: Scroll animations, stats counter, hamburger, sticky CTA, WhatsApp
 * Pure vanilla JS — no dependencies.
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     1. PAGE FADE-IN (anti-FOUC)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    requestAnimationFrame(function () {
      document.body.style.opacity = '1';
    });
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     2. ACTIVE NAV LINK (match current page)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var currentPath = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.nav__links a');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3. HAMBURGER MENU (full-screen mobile overlay)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var toggle = document.querySelector('.nav__toggle');
    var links  = document.querySelector('.nav__links');
    if (!toggle || !links) return;

    function closeMenu() {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    }

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     4. SCROLL ANIMATIONS (.animate-on-scroll → .visible)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { observer.observe(el); });
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     5. STATS COUNTER (IntersectionObserver + requestAnimationFrame)
        Fires once; does not re-trigger if user scrolls away and back.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    var statNumbers = statsSection.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    var hasAnimated = false;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1500; // ms
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        var eased = 1 - (1 - progress) * (1 - progress);
        var current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      statNumbers.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || hasAnimated) return;
        hasAnimated = true;
        observer.unobserve(entry.target);
        statNumbers.forEach(animateCounter);
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     6. MOBILE STICKY CTA BAR
        Appears after user scrolls past 80% of hero height.
        Not shown on contact.html. Close button hides for session.
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var bar       = document.getElementById('sticky-cta-bar');
    var closeBtn  = bar ? bar.querySelector('.sticky-cta-bar__close') : null;
    var heroSec   = document.getElementById('hero-section');
    var isContact = window.location.pathname.indexOf('contact.html') !== -1;

    if (!bar || isContact) return;

    // If user already closed it this session, don't show
    if (sessionStorage.getItem('stickyCtaDismissed') === '1') return;

    var shown = false;

    function checkScroll() {
      if (shown) return;
      var threshold = heroSec
        ? heroSec.offsetHeight * 0.8
        : window.innerHeight * 0.8;

      if (window.scrollY > threshold) {
        bar.classList.add('visible');
        shown = true;
        window.removeEventListener('scroll', checkScroll);
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        bar.classList.remove('visible');
        bar.style.display = 'none';
        sessionStorage.setItem('stickyCtaDismissed', '1');
      });
    }
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     7. FLOATING WHATSAPP BUTTON — hide on contact.html
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var btn = document.querySelector('.whatsapp-btn');
    if (!btn) return;
    var isContact = window.location.pathname.indexOf('contact.html') !== -1;
    if (isContact) {
      btn.style.display = 'none';
    }
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     8. NAV SCROLL STATE (for blur/glass effect)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    function setScrollState() {
      nav.classList.toggle('nav--scrolled', window.scrollY > 24);
    }

    setScrollState();
    window.addEventListener('scroll', setScrollState, { passive: true });
  })();

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     9. YEAR FILL (footer copyright)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  (function () {
    var yearEls = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) { el.textContent = year; });
  })();

});
