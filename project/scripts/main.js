/**
 * NairaWise — main.js
 * Shared utilities: nav, daily tip, lazy loading, newsletter form
 * WDD 131 W06 Project — Olise Ebinum
 */

'use strict';

/* ════════════════════════════════════
   DATA — Daily Financial Tips
════════════════════════════════════ */
const TIPS = [
  { text: "Save before you spend. Move a fixed amount to savings the moment you receive your salary — not what's left at month-end." },
  { text: "The 50/30/20 rule: allocate 50% of income to needs, 30% to wants, and at least 20% to savings and debt repayment." },
  { text: "Keep 3–6 months of living expenses in a dedicated emergency fund before investing in any higher-risk asset." },
  { text: "Inflation erodes idle cash. Treasury Bills and FGN Bonds offer low-risk ways to preserve purchasing power in naira." },
  { text: "Automate your savings. Set a standing order to sweep funds to a high-yield account the day after salary day." },
  { text: "Track every naira for one month. Most people underestimate their spending on food and data by at least 30%." },
  { text: "An emergency fund is not an investment — it is insurance. Keep it liquid in a separate savings account." },
  { text: "Compound interest rewards patience. ₦10,000 invested monthly at 10% annually becomes over ₦2 million in 10 years." },
  { text: "Avoid lifestyle inflation. Each pay rise is an opportunity to increase your savings rate, not just your spending." },
  { text: "Diversify. Spreading funds across T-Bills, a money market fund, and a small equity allocation reduces concentration risk." },
  { text: "Your credit history matters. Pay bills on time and avoid maxing out any credit facility, even if you can afford it." },
  { text: "Review your budget monthly. Life changes — your budget should adapt to reflect new realities, not old assumptions." },
  { text: "Buy assets before luxuries. A mutual fund position built monthly outperforms a one-off luxury purchase over time." },
  { text: "Negotiate everything: rent, data plans, subscriptions. A 10% saving on monthly bills adds up to a 13th month salary." },
  { text: "Set a specific financial goal with a deadline. 'Save more' is a wish. 'Save ₦500,000 by December' is a plan." },
];

/* ════════════════════════════════════
   NAV — Hamburger Toggle
════════════════════════════════════ */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on nav link click (mobile)
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ════════════════════════════════════
   DAILY TIP — Rotate & Persist
════════════════════════════════════ */
function initDailyTip() {
  const tipText    = document.getElementById('daily-tip-text');
  const tipCounter = document.getElementById('tip-counter');
  const prevBtn    = document.getElementById('tip-prev');
  const nextBtn    = document.getElementById('tip-next');
  if (!tipText) return;

  // Determine today's base tip index (rotates daily)
  const today    = new Date().toDateString();
  const dayIndex = Math.floor(Date.now() / 86400000) % TIPS.length;

  // Retrieve saved index or default to today's
  const saved = JSON.parse(localStorage.getItem('nw_tip_state') || 'null');
  let current  = (saved && saved.date === today) ? saved.index : dayIndex;

  function renderTip(idx) {
    current = (idx + TIPS.length) % TIPS.length;
    tipText.textContent = TIPS[current].text;
    tipCounter.textContent = `${current + 1} / ${TIPS.length}`;
    localStorage.setItem('nw_tip_state', JSON.stringify({ date: today, index: current }));
  }

  renderTip(current);
  if (prevBtn) prevBtn.addEventListener('click', () => renderTip(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderTip(current + 1));
}

/* ════════════════════════════════════
   LAZY LOADING — Intersection Observer
════════════════════════════════════ */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.removeAttribute('data-src');
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      obs.unobserve(img);
    });
  }, { rootMargin: '200px 0px' });

  images.forEach(img => observer.observe(img));
}

/* ════════════════════════════════════
   NEWSLETTER FORM — Validate & Submit
════════════════════════════════════ */
function initNewsletterForm() {
  const form    = document.getElementById('newsletter-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  // Validate a single field, return true if valid
  function validateField(input) {
    const isEmpty = input.value.trim() === '';
    const isEmail = input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    const invalid = isEmpty || (input.type === 'email' && isEmail);
    input.classList.toggle('invalid', invalid);
    return !invalid;
  }

  // Real-time validation on blur
  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input[required], select[required]')];
    const allValid = fields.map(validateField).every(Boolean);
    if (!allValid) return;

    // Persist subscriber name for personalised greeting
    const nameInput = form.querySelector('#sub-name');
    if (nameInput) {
      localStorage.setItem('nw_subscriber_name', nameInput.value.trim());
    }

    form.style.display = 'none';
    if (success) success.classList.add('visible');
  });
}

/* ════════════════════════════════════
   FOOTER — Last Modified
════════════════════════════════════ */
function initLastModified() {
  const el = document.getElementById('last-modified');
  if (!el) return;
  el.textContent = new Date(document.lastModified).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initDailyTip();
  initLazyImages();
  initNewsletterForm();
  initLastModified();
});