// ── DOM references ──
const input    = document.querySelector('#favchap');
const button   = document.querySelector('#add-btn');
const list     = document.querySelector('#list');
const emptyMsg = document.querySelector('#empty-msg');

// ── Initialize chapters array from localStorage or empty array ──
let chaptersArray = getChapterList() || [];

// ── Populate the list on page load from stored data ──
chaptersArray.forEach(chapter => {
  displayList(chapter);
});

updateEmptyMessage();

// ── Button click event listener ──
button.addEventListener('click', () => {
  if (input.value != '') {
    displayList(input.value);
    chaptersArray.push(input.value);
    setChapterList();
    input.value = '';
    input.focus();
  } else {
    input.classList.add('shake');
    input.addEventListener('animationend', () => {
      input.classList.remove('shake');
    }, { once: true });
    input.focus();
  }
  updateEmptyMessage();
});

// Allow Enter key to submit
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    button.click();
  }
});

// ── displayList: builds and appends a list item with a delete button ──
function displayList(item) {
  let li           = document.createElement('li');
  let deleteButton = document.createElement('button');

  li.textContent           = item;
  deleteButton.textContent = '❌';
  deleteButton.classList.add('delete');
  deleteButton.setAttribute('aria-label', `Delete ${item}`);

  li.append(deleteButton);
  list.append(li);

  deleteButton.addEventListener('click', function () {
    list.removeChild(li);
    deleteChapter(li.textContent);
    updateEmptyMessage();
    input.focus();
  });
}

// ── setChapterList: saves chaptersArray to localStorage as JSON string ──
function setChapterList() {
  localStorage.setItem('myFavBOMList', JSON.stringify(chaptersArray));
}

// ── getChapterList: retrieves and parses the localStorage item ──
function getChapterList() {
  return JSON.parse(localStorage.getItem('myFavBOMList'));
}

// ── deleteChapter: removes a chapter from the array and updates localStorage ──
function deleteChapter(chapter) {
  chapter = chapter.slice(0, chapter.length - 1);
  chaptersArray = chaptersArray.filter(item => item !== chapter);
  setChapterList();
}

// ── updateEmptyMessage: shows or hides the empty state message ──
function updateEmptyMessage() {
  if (chaptersArray.length === 0) {
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
  }
}

// ── Last modified date in footer ──
const lastModifiedSpan = document.getElementById('lastModified');
if (lastModifiedSpan) {
  lastModifiedSpan.textContent = new Date(document.lastModified).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
}