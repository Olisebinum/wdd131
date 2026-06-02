// ── Product array (course-provided data source) ──
const products = [
  { id: "fc-1", name: "Flux Capacitor" },
  { id: "ss-1", name: "Sonic Screwdriver" },
  { id: "ag-1", name: "Anti-Gravity Boots" },
  { id: "tp-1", name: "Teleportation Pod" },
  { id: "ir-1", name: "Invisibility Raincoat" }
];

// ── Populate Product Name <select> dynamically from products array ──
// Each option's value = product.id; display text = product.name
function populateProductSelect() {
  const select = document.getElementById('product-name');
  if (!select) return;

  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = product.name;
    select.appendChild(option);
  });
}

// ── Footer: current year and last modified timestamp ──
function setFooterDates() {
  const yearEl = document.getElementById('year');
  const modEl  = document.getElementById('lastModified');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  if (modEl) {
    modEl.textContent = new Date(document.lastModified).toLocaleString(
      'en-US',
      {
        year:   'numeric',
        month:  '2-digit',
        day:    '2-digit',
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }
    );
  }
}

// ── Init ──
populateProductSelect();
setFooterDates();