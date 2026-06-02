// ── Product array (needed to resolve name from id) ──
const products = [
  { id: "fc-1", name: "Flux Capacitor" },
  { id: "ss-1", name: "Sonic Screwdriver" },
  { id: "ag-1", name: "Anti-Gravity Boots" },
  { id: "tp-1", name: "Teleportation Pod" },
  { id: "ir-1", name: "Invisibility Raincoat" }
];

// ── Increment and display localStorage review counter ──
function incrementReviewCount() {
  const current  = parseInt(localStorage.getItem('lumiere_review_count') || '0', 10);
  const updated  = current + 1;
  localStorage.setItem('lumiere_review_count', String(updated));
  return updated;
}

function displayReviewCount(count) {
  const el = document.getElementById('review-count');
  if (el) el.textContent = String(count);
}

// ── Parse URL params and render summary rows ──
function displaySummary() {
  const params   = new URLSearchParams(window.location.search);
  const rows     = document.getElementById('summary-rows');
  if (!rows) return;

  const productId   = params.get('productName') || '';
  const rating      = params.get('rating')       || '';
  const installDate = params.get('installDate')  || '';
  const features    = params.getAll('features');
  const written     = params.get('writtenReview') || '';
  const userName    = params.get('userName')      || '';

  // Resolve product name from id
  const match       = products.find((p) => p.id === productId);
  const productName = match ? match.name : (productId || '—');

  // Build filled-star display string
  const starCount   = parseInt(rating, 10) || 0;
  const starDisplay = starCount > 0
    ? `${'★'.repeat(starCount)}${'☆'.repeat(5 - starCount)} (${starCount} / 5)`
    : '—';

  // Format date for display
  let dateDisplay = '—';
  if (installDate) {
    const d = new Date(`${installDate}T12:00:00`);
    dateDisplay = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Summary data — array of objects
  const summary = [
    { key: 'Product',           val: productName },
    { key: 'Rating',            val: starDisplay },
    { key: 'Date Installed',    val: dateDisplay },
    { key: 'Useful Features',   val: features.length > 0 ? features.join(', ') : 'None selected' },
    { key: 'Written Review',    val: written || '(Not provided)' },
    { key: 'Reviewer',          val: userName || 'Anonymous' }
  ];

  // Build rows using template literals
  summary.forEach((item) => {
    const row  = document.createElement('div');
    const key  = document.createElement('span');
    const val  = document.createElement('span');

    row.className  = 'summary-row';
    key.className  = 's-key';
    val.className  = 's-val';
    key.textContent = item.key;
    val.textContent = item.val;

    row.appendChild(key);
    row.appendChild(val);
    rows.appendChild(row);
  });
}

// ── Footer dates ──
function setFooterDates() {
  const yearEl = document.getElementById('year');
  const modEl  = document.getElementById('lastModified');

  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (modEl) {
    modEl.textContent = new Date(document.lastModified).toLocaleString(
      'en-US',
      {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      }
    );
  }
}

// ── Init ──
const count = incrementReviewCount();
displayReviewCount(count);
displaySummary();
setFooterDates();