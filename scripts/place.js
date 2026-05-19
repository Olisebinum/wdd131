// ── Nigeria Place Page – JavaScript ──────────────────

// ── Footer: Current Year ──
const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── Footer: Last Modified ──
const lastModSpan = document.querySelector('#lastmodified');
if (lastModSpan) {
  lastModSpan.textContent = document.lastModified;
}

// ── Wind Chill Calculation ─────────────────────────
// Static weather values (metric)
const temperature = 32;   // °C — displayed on page
const windSpeed = 12;     // km/h — displayed on page

// Wind Chill formula (Metric / Environment Canada):
// WC = 13.12 + 0.6215T - 11.37(V^0.16) + 0.3965T(V^0.16)
// T = temperature in °C, V = wind speed in km/h
function calculateWindChill(temp, speed) {
  return (13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16)).toFixed(1);
}

// Only calculate if conditions are met:
// Temperature <= 10°C AND Wind speed > 4.8 km/h
const windChillEl = document.querySelector('#wind-chill');
if (windChillEl) {
  if (temperature <= 10 && windSpeed > 4.8) {
    windChillEl.textContent = `${calculateWindChill(temperature, windSpeed)} °C`;
  } else {
    windChillEl.textContent = 'N/A';
  }
}