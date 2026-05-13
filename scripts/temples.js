// ── Temple Album – JavaScript ──────────────────────────

// ── Footer: Current Year ──
const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── Footer: Last Modified Date ──
const lastModSpan = document.querySelector('#lastmodified');
if (lastModSpan) {
  lastModSpan.textContent = document.lastModified;
}

// ── Hamburger Menu Toggle ──────────────────────────────
const hamburger = document.querySelector('#hamburger');
const nav = document.querySelector('#main-nav');

hamburger.addEventListener('click', function () {
  const isOpen = nav.classList.toggle('open');

  // Toggle icon: ☰ when closed, ✕ when open
  hamburger.innerHTML = isOpen ? '&#10005;' : '&#9776;';

  // Update aria-expanded for accessibility
  hamburger.setAttribute('aria-expanded', isOpen);
});

// ── Close nav when a link is clicked (mobile UX) ──────
nav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('open');
    hamburger.innerHTML = '&#9776;';
    hamburger.setAttribute('aria-expanded', false);
  });
});