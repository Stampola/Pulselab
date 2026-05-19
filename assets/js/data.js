/* ============================================================
   PULSELAB — Editable content data (managed via admin panel)
   On a real backend swap: replace localStorage with an API call.
   ============================================================ */

const DEFAULT_DATA = {
  packages: {
    starter: { priceTHB: 19900, enabled: true },
    business: { priceTHB: 79900, enabled: true, featured: true },
    enterprise: { priceTHB: 250000, enabled: true, isCustom: true }
  },
  settings: {
    siteName: 'Pulselab',
    tagline: 'Web design + SEO studio',
    email: 'hello@pulselab.work',
    phone: '+66 2 123 4567',
    line: '@pulselab',
    address: 'Bangkok, Thailand',
    socialFacebook: 'https://facebook.com/pulselab',
    socialInstagram: 'https://instagram.com/pulselab',
    socialLinkedin: 'https://linkedin.com/company/pulselab'
  },
  portfolio: [
    { id: 'p1', title: 'Modora Skincare', category: 'E-commerce', year: '2026', metric: '+340% revenue', color: 'linear-gradient(135deg, #ffd6e0 0%, #ffa3bf 100%)' },
    { id: 'p2', title: 'Lumen Hospitality', category: 'Enterprise', year: '2026', metric: 'Custom CMS', color: 'linear-gradient(135deg, #c2e8ff 0%, #6fb8ff 100%)' },
    { id: 'p3', title: 'NorthBound B2B', category: 'SaaS', year: '2025', metric: '#1 ranking', color: 'linear-gradient(135deg, #d8c2ff 0%, #9b6ff5 100%)' },
    { id: 'p4', title: 'Mae Sai Coffee', category: 'Landing', year: '2025', metric: '4× conversion', color: 'linear-gradient(135deg, #ffe2b3 0%, #ffa84a 100%)' },
    { id: 'p5', title: 'Soulful Studio', category: 'Portfolio', year: '2025', metric: 'Awwwards mention', color: 'linear-gradient(135deg, #c2ffd6 0%, #4fdf8c 100%)' },
    { id: 'p6', title: 'Vientiane Hotels Group', category: 'Booking', year: '2025', metric: 'Multi-language', color: 'linear-gradient(135deg, #ffd0c2 0%, #ff7a5e 100%)' }
  ],
  leads: []
};

const DataStore = {
  STORAGE_KEY: 'pulselab_data',

  load() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { console.warn('Data load failed', e); }
    return DEFAULT_DATA;
  },

  save(data) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  },

  get() {
    if (!this._cache) this._cache = this.load();
    return this._cache;
  },

  update(patch) {
    const data = this.get();
    const merged = { ...data, ...patch };
    this._cache = merged;
    this.save(merged);
    return merged;
  },

  reset() {
    localStorage.removeItem(this.STORAGE_KEY);
    this._cache = null;
  },

  addLead(lead) {
    const data = this.get();
    data.leads.unshift({
      ...lead,
      id: 'lead_' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'new'
    });
    this.save(data);
  },

  removeLead(id) {
    const data = this.get();
    data.leads = data.leads.filter(l => l.id !== id);
    this.save(data);
  },

  updateLead(id, patch) {
    const data = this.get();
    const i = data.leads.findIndex(l => l.id === id);
    if (i > -1) {
      data.leads[i] = { ...data.leads[i], ...patch };
      this.save(data);
    }
  },

  formatPrice(thb) {
    return '฿' + thb.toLocaleString('en-US');
  }
};

/* Render package prices into any element with [data-price="pkg.<key>"] */
function renderPrices() {
  const data = DataStore.get();
  Object.entries(data.packages).forEach(([key, pkg]) => {
    document.querySelectorAll(`[data-price="${key}"]`).forEach(el => {
      if (pkg.isCustom) {
        el.textContent = '';
      } else {
        el.textContent = pkg.priceTHB.toLocaleString('en-US');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', renderPrices);
