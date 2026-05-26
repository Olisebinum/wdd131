// Display the date this document was last modified
const lastModifiedSpan = document.getElementById('lastModified');
lastModifiedSpan.textContent = new Date(document.lastModified).toLocaleDateString(
  'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' }
);

// Trigger the fade-from-black animation once each lazy image has loaded.
// The browser defers fetching lazy images until they scroll into view;
// the 'load' event fires at that moment, so we add the .loaded class then.
const images = document.querySelectorAll('img[loading="lazy"]');

images.forEach((img) => {
  if (img.complete) {
    // Image was already in the cache / viewport on page load
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  }
});