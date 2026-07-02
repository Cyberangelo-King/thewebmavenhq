/* ─── NUMBER COUNTER ANIMATION ─────────────────────────────────────── */
(function () {
  var counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;

    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseInt(el.getAttribute("data-count"), 10);
      animateCounter(el, target, 1800);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) {
    counterObserver.observe(el);
  });
})();

/* ─── STICKY MOBILE CTA (auto-hides at bottom, shows after hero) ───── */
(function () {
  var heroSection = document.querySelector(".hero");
  if (!heroSection) return;

  var stickyBar = document.createElement("div");
  stickyBar.className = "mobile-cta-bar";
  stickyBar.innerHTML = '<a class="btn btn--primary btn--lg" href="contact.html">Book a Free Discovery Call</a>';
  stickyBar.setAttribute("aria-hidden", "true");
  document.body.appendChild(stickyBar);

  var heroBottom = 0;

  function updateHeroBottom() {
    var rect = heroSection.getBoundingClientRect();
    heroBottom = rect.bottom + window.scrollY;
  }

  updateHeroBottom();
  window.addEventListener("resize", updateHeroBottom, { passive: true });

  var shown = false;
  window.addEventListener("scroll", function () {
    var pastHero = window.scrollY > heroBottom;
    if (pastHero !== shown) {
      shown = pastHero;
      stickyBar.setAttribute("aria-hidden", String(!shown));
      stickyBar.classList.toggle("visible", shown);
    }
  }, { passive: true });
})();
