/* ============================================================
   LIFTORA — Main UX: nav, theme, reveals, magnetic, cursor
   ============================================================ */

/* Nav scroll state */
const nav = document.querySelector('.nav');
if (nav) {
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 16);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile menu */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

/* Theme toggle */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('liftora_theme') || 'light';
    this.set(saved);
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  set(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('liftora_theme', theme);
    document.querySelectorAll('[data-action="toggle-theme"]').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀' : '☾';
    });
  },
  toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    this.set(next);
  }
};
ThemeManager.init();

/* Reveal-on-scroll via IntersectionObserver */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* Magnetic effect on buttons with .magnetic */
const magneticEls = document.querySelectorAll('.magnetic');
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (supportsHover) {
  magneticEls.forEach(el => {
    let bounds;
    const onMove = (e) => {
      bounds = el.getBoundingClientRect();
      const x = e.clientX - bounds.left - bounds.width / 2;
      const y = e.clientY - bounds.top - bounds.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    };
    const onLeave = () => {
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

/* Custom cursor (desktop only) */
if (supportsHover) {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);
  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .package, .portfolio-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('hovering'));
    el.addEventListener('mouseleave', () => dot.classList.remove('hovering'));
  });
}

/* FAQ accordion */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-question');
  if (q) {
    q.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  }
});

/* Toast helper */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}
window.showToast = showToast;

/* Contact form (saves to DataStore lead list) */
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const lead = Object.fromEntries(formData.entries());
    DataStore.addLead(lead);
    contactForm.reset();
    showToast(I18nManager.t('contact.success'));
  });
}

/* Mark current page link active */
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === path || (path === 'index.html' && href === './')) {
    a.classList.add('active');
  }
});

/* Counter animation for stats */
const animateNumber = (el, target) => {
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const isLess = target.includes('<');
  const num = parseFloat(target.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;
  let current = 0;
  const duration = 1400;
  const start = performance.now();
  const step = (t) => {
    const progress = Math.min((t - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = num * eased;
    let display = (num % 1 === 0) ? Math.round(current).toString() : current.toFixed(1);
    if (isLess) display = '< ' + display + 's';
    else display = (isPlus ? '+' : '') + display + (isPercent ? '%' : (target.includes('+') ? '+' : ''));
    el.textContent = display;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = el.dataset.target || el.textContent;
      el.dataset.target = target;
      animateNumber(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-num').forEach(el => {
  el.dataset.target = el.textContent;
  statObserver.observe(el);
});
