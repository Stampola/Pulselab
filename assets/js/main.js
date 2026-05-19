/* ============================================================
   PULSELAB — Main UX
   ============================================================
   Sections:
   1. Admin session guard       (runs first, before DOM-heavy work)
   2. Navigation behaviours     (sticky nav, mobile menu, active link)
   3. Theme manager             (light/dark, persisted)
   4. Scroll reveals            (IntersectionObserver)
   5. Magnetic buttons + cursor (desktop only)
   6. FAQ accordion
   7. Toast helper              (showToast — globally exposed)
   8. Stats counter animation
   9. Contact form              (validation, mailto, redirect)
   10. Cookie consent banner    (PDPA, i18n-aware)
   ============================================================ */

(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var i18n = function (key, fallback) {
    return (window.I18nManager ? window.I18nManager.t(key) : (fallback || key));
  };

  /* 1. Admin session guard (24h auto-logout) */
  (function adminSessionGuard() {
    if (location.pathname.indexOf('/admin/') === -1) return;
    if (/login\.html$/.test(location.pathname)) return;

    var TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    var raw = localStorage.getItem('pulselab_session');
    if (!raw) { location.href = 'login.html'; return; }
    try {
      var s = JSON.parse(raw);
      if (!s || !s.loginAt || (Date.now() - s.loginAt) > TWENTY_FOUR_HOURS) {
        localStorage.removeItem('pulselab_session');
        location.href = 'login.html';
      }
    } catch (e) {
      localStorage.removeItem('pulselab_session');
      location.href = 'login.html';
    }
  })();

  /* 2. Navigation */
  function setupNav() {
    var nav = $('.nav');
    if (nav) {
      var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 16); };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    var menuToggle = $('.menu-toggle');
    var navLinks   = $('.nav-links');
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function () {
        var open = navLinks.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(open));
      });
      navLinks.addEventListener('click', function (e) {
        if (e.target && e.target.tagName === 'A') navLinks.classList.remove('open');
      });
    }
    var path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav-links a').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  }

  /* 3. Theme */
  var ThemeManager = {
    KEY: 'pulselab_theme',
    init: function () {
      this.set(localStorage.getItem(this.KEY) || 'dark');
      var self = this;
      $$('[data-action="toggle-theme"]').forEach(function (btn) {
        btn.addEventListener('click', function () { self.toggle(); });
      });
    },
    set: function (theme) {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem(this.KEY, theme);
      $$('[data-action="toggle-theme"]').forEach(function (btn) {
        btn.textContent = theme === 'dark' ? '☀' : '☾';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    },
    toggle: function () {
      this.set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    }
  };

  /* 4. Reveals */
  function setupReveals() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    $$('.reveal').forEach(function (el) { obs.observe(el); });
  }

  var supportsHover  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reducedMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 5. Magnetic + cursor */
  function setupMagnetic() {
    if (!supportsHover || reducedMotion) return;
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.25;
        el.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  function setupCustomCursor() {
    if (!supportsHover || reducedMotion) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    document.addEventListener('mousemove', function (e) {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
    $$('a, button, .package, .portfolio-card, .service-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('hovering'); });
    });
  }

  /* 6. FAQ */
  function setupFaq() {
    $$('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-question');
      if (!q) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var open = item.classList.toggle('open');
        q.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* 7. Toast */
  function showToast(message) {
    var toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.classList.remove('show'); }, 3000);
  }
  window.showToast = showToast;

  /* 8. Stats counters */
  function setupCounters() {
    if (!('IntersectionObserver' in window) || reducedMotion) return;
    function animate(el, target) {
      var isPercent = target.indexOf('%') !== -1;
      var isPlus    = target.indexOf('+') !== -1;
      var isLess    = target.indexOf('<') !== -1;
      var num = parseFloat(target.replace(/[^0-9.]/g, ''));
      if (isNaN(num)) return;
      var duration = 1400, start = performance.now();
      function step(t) {
        var progress = Math.min((t - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = num * eased;
        var display = (num % 1 === 0) ? Math.round(current).toString() : current.toFixed(1);
        if (isLess) display = '< ' + display + 's';
        else display = (isPlus ? '+' : '') + display + (isPercent ? '%' : '');
        el.textContent = display;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = el.dataset.target || el.textContent;
        el.dataset.target = target;
        animate(el, target);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    $$('.stat-num').forEach(function (el) {
      el.dataset.target = el.textContent;
      obs.observe(el);
    });
  }

  /* 9. Contact form — mailto: (zero setup, works everywhere)
     Replace CONTACT_EMAIL below with your real address. On submit
     we open the visitor's email client with subject + body pre-filled.
     Also saves a copy to DataStore so admin/leads.html still works. */
  var CONTACT_EMAIL = 'hello@pulselab.work';

  function setupContactForm() {
    var form = $('#contactForm');
    if (!form) return;

    form.removeAttribute('novalidate');

    var pkg = new URLSearchParams(location.search).get('pkg');
    if (pkg) {
      var sel = $('#cf-package', form);
      if (sel) {
        var has = Array.prototype.some.call(sel.options, function (o) { return o.value === pkg; });
        if (has) sel.value = pkg;
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var fd = new FormData(form);
      var lead = {};
      fd.forEach(function (v, k) { lead[k] = v; });

      try { if (window.DataStore) window.DataStore.addLead(lead); }
      catch (err) { console.warn('Local lead save failed:', err); }

      var subject = 'New project inquiry from ' + (lead.name || 'website');
      var lines = [
        'Name: '    + (lead.name    || '-'),
        'Email: '   + (lead.email   || '-'),
        'Phone: '   + (lead.phone   || '-'),
        'Company: ' + (lead.company || '-'),
        'Package: ' + (lead.package || '-'),
        'Budget: '  + (lead.budget  || '-'),
        '',
        'Message:',
        (lead.message || '-'),
        '',
        '— Sent via pulselab.work contact form'
      ];
      var body = lines.join('\n');
      var mailto = 'mailto:' + CONTACT_EMAIL +
                   '?subject=' + encodeURIComponent(subject) +
                   '&body='    + encodeURIComponent(body);

      window.location.href = mailto;
      setTimeout(function () {
        form.reset();
        location.href = 'thank-you.html';
      }, 600);
    });
  }

  /* 10. Cookie consent banner (PDPA) */
  function setupCookieConsent() {
    if (location.pathname.indexOf('/admin/') !== -1) return;
    var KEY = 'pulselab_cookie_consent';
    if (localStorage.getItem(KEY)) return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', i18n('cookie.text', 'Cookie consent'));
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<p class="cookie-text">' +
          '<span data-i18n="cookie.text">We use cookies to improve your experience and analyse traffic.</span> ' +
          '<a href="privacy.html" data-i18n="cookie.link">Privacy Policy</a>.' +
        '</p>' +
        '<div class="cookie-actions">' +
          '<button class="btn btn-ghost btn-sm" id="cookieDecline" data-i18n="cookie.decline">Decline</button>' +
          '<button class="btn btn-primary btn-sm" id="cookieAccept" data-i18n="cookie.accept">Accept all</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    if (window.I18nManager) window.I18nManager.apply();

    requestAnimationFrame(function () { banner.classList.add('show'); });

    function close(value) {
      localStorage.setItem(KEY, value);
      banner.classList.remove('show');
      setTimeout(function () { banner.remove(); }, 300);
    }
    banner.querySelector('#cookieAccept').addEventListener('click', function () { close('accepted'); });
    banner.querySelector('#cookieDecline').addEventListener('click', function () { close('declined'); });
  }

  function init() {
    ThemeManager.init();
    setupNav();
    setupReveals();
    setupMagnetic();
    setupCustomCursor();
    setupFaq();
    setupCounters();
    setupContactForm();
    setupCookieConsent();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
