// Dynamically set the current year in the footer
const yearSpan = document.getElementById("currentyear");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Dynamically set the last modified date
const lastModifiedPara = document.getElementById("lastModified");
if (lastModifiedPara) {
  lastModifiedPara.textContent = "Last Modification: " + document.lastModified;
}