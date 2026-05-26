// ── Filtered Temple Album – JavaScript ────────────────────

// ── Temple Data Array ─────────────────────────────────────
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  // ── Additional temple objects ──────────────────────────
  {
    templeName: "Salt Lake",
    location: "Salt Lake City, Utah, United States",
    dedicated: "1893, April, 6",
    area: 253015,
    imageUrl:
      "https://www.churchofjesuschrist.org/imgs/64de5983126b11eca393eeeeac1e50dfc2db6c7e/full/640%2C/0/default"
  },
  {
    templeName: "Accra Ghana",
    location: "Accra, Ghana",
    dedicated: "2004, January, 11",
    area: 17500,
    imageUrl:
      "https://www.churchofjesuschrist.org/imgs/7cf8e8b9e5a5a1f379d4e2c9bc2166f9c6007aca/full/640%2C/0/default"
  },
  {
    templeName: "Rome Italy",
    location: "Rome, Italy",
    dedicated: "2019, March, 10",
    area: 41010,
    imageUrl:
      "https://www.churchofjesuschrist.org/imgs/17e2c70d687fffedfe115197e57fa8f5d1d369bb/full/640%2C/0/default"
  },
  {
    templeName: "Nauvoo Illinois",
    location: "Nauvoo, Illinois, United States",
    dedicated: "2002, June, 27",
    area: 54000,
    imageUrl:
      "https://www.churchofjesuschrist.org/imgs/04d0f7f577ff089808b71b864e1f58b2e877a124/full/640%2C/0/default"
  },
  {
    templeName: "Tokyo Japan",
    location: "Tokyo, Japan",
    dedicated: "1980, October, 27",
    area: 52690,
    imageUrl:
      "https://www.churchofjesuschrist.org/imgs/df6b96801c9f11ec99eeeeeeac1ea2207e7c517b/full/640%2C/0/default"
  }
];

// ── Helper: extract dedication year from "YYYY, Month, D" ──
function getDedicationYear(dedicatedString) {
  return parseInt(dedicatedString.split(",")[0].trim(), 10);
}

// ── Create a single temple card element ───────────────────
function createTempleCard(temple) {
  const card = document.createElement("article");
  card.classList.add("temple-card");

  card.innerHTML = `
    <img
      src="${temple.imageUrl}"
      alt="${temple.templeName} Temple"
      loading="lazy"
      width="400"
      height="250"
    >
    <div class="card-body">
      <h2>${temple.templeName}</h2>
      <dl>
        <dt>Location</dt>
        <dd>${temple.location}</dd>
        <dt>Dedicated</dt>
        <dd>${temple.dedicated}</dd>
        <dt>Area</dt>
        <dd>${temple.area.toLocaleString()} sq ft</dd>
      </dl>
    </div>
  `;

  return card;
}

// ── Render filtered temples into the gallery ──────────────
function displayTemples(filteredList) {
  const gallery = document.querySelector("#gallery");
  gallery.innerHTML = "";

  if (filteredList.length === 0) {
    const msg = document.createElement("p");
    msg.classList.add("no-results");
    msg.textContent = "No temples match this filter.";
    gallery.appendChild(msg);
    return;
  }

  filteredList.forEach(function (temple) {
    gallery.appendChild(createTempleCard(temple));
  });
}

// ── Filter logic ──────────────────────────────────────────
function filterTemples(filter) {
  const filterLabel = document.querySelector("#filter-label");
  let results = [];

  switch (filter) {
    case "old":
      results = temples.filter(t => getDedicationYear(t.dedicated) < 1900);
      filterLabel.textContent = "Showing: Old Temples (dedicated before 1900)";
      break;
    case "new":
      results = temples.filter(t => getDedicationYear(t.dedicated) > 2000);
      filterLabel.textContent = "Showing: New Temples (dedicated after 2000)";
      break;
    case "large":
      results = temples.filter(t => t.area > 90000);
      filterLabel.textContent = "Showing: Large Temples (over 90,000 sq ft)";
      break;
    case "small":
      results = temples.filter(t => t.area < 10000);
      filterLabel.textContent = "Showing: Small Temples (under 10,000 sq ft)";
      break;
    case "home":
    default:
      results = temples;
      filterLabel.textContent = "Showing: All Temples";
      break;
  }

  displayTemples(results);
}

// ── Nav click handler ─────────────────────────────────────
const nav = document.querySelector("#main-nav");
const navLinks = nav.querySelectorAll("a");

navLinks.forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Update active state
    navLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");

    // Filter and display
    const filter = this.getAttribute("data-filter");
    filterTemples(filter);

    // Close mobile menu if open
    nav.classList.remove("open");
    hamburger.innerHTML = "&#9776;";
    hamburger.setAttribute("aria-expanded", false);
  });
});

// ── Hamburger Menu Toggle ─────────────────────────────────
const hamburger = document.querySelector("#hamburger");

hamburger.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  hamburger.innerHTML = isOpen ? "&#10005;" : "&#9776;";
  hamburger.setAttribute("aria-expanded", isOpen);
});

// ── Footer: Current Year ──────────────────────────────────
const yearSpan = document.querySelector("#currentyear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── Footer: Last Modified Date ────────────────────────────
const lastModSpan = document.querySelector("#lastmodified");
if (lastModSpan) {
  lastModSpan.textContent = document.lastModified;
}

// ── Initial render (show all) ─────────────────────────────
filterTemples("home");