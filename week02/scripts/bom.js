// ── BOM Top 10 – DOM References ──
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// ── Constants ──
const MAX_CHAPTERS = 10;

const BOM_BOOKS = [
  '1 Nephi', '2 Nephi', 'Jacob', 'Enos', 'Jarom', 'Omni',
  'Words of Mormon', 'Mosiah', 'Alma', 'Helaman',
  '3 Nephi', '4 Nephi', 'Mormon', 'Ether', 'Moroni'
];

const CHAPTER_COUNTS = {
  '1 Nephi': 22, '2 Nephi': 33, 'Jacob': 7, 'Enos': 1,
  'Jarom': 1, 'Omni': 1, 'Words of Mormon': 1, 'Mosiah': 29,
  'Alma': 63, 'Helaman': 16, '3 Nephi': 30, '4 Nephi': 1,
  'Mormon': 9, 'Ether': 15, 'Moroni': 10
};

// ── Set current year in footer ──
const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── Create a feedback <p> element below the button ──
const feedback = document.createElement('p');
feedback.id = 'feedback';
feedback.setAttribute('aria-live', 'polite');
feedback.style.cssText = 'margin-top:0.6rem; font-size:0.85rem; min-height:1.1rem;';
button.after(feedback);

// ── Helper: show feedback message ──
function showFeedback(msg, isError = true) {
  feedback.textContent = msg;
  feedback.style.color = isError ? '#b91c1c' : '#166534';
}

function clearFeedback() {
  feedback.textContent = '';
}

// ── Helper: normalize and parse "Book Chapter" input ──
function parseInput(raw) {
  const cleaned = raw.trim().replace(/\s+/g, ' ');
  const match = cleaned.match(/^(.+?)\s+(\d+)$/);
  if (!match) return null;

  const bookRaw = match[1].trim();
  const chapter = parseInt(match[2], 10);
  const book = bookRaw.replace(/\b\w/g, c => c.toUpperCase());
  return { book, chapter, label: `${book} ${chapter}` };
}

// ── Helper: validate parsed entry against BOM books ──
function validate(parsed) {
  if (!parsed) return 'Please use the format: Book Chapter (e.g. "Alma 5").';

  const matched = BOM_BOOKS.find(b => b.toLowerCase() === parsed.book.toLowerCase());
  if (!matched) return `"${parsed.book}" is not a Book of Mormon book.`;

  const max = CHAPTER_COUNTS[matched];
  if (parsed.chapter < 1 || parsed.chapter > max) {
    return `${matched} only has ${max} chapter${max > 1 ? 's' : ''}.`;
  }
  return null; // valid
}

// ── Helper: check for duplicate in existing list ──
function isDuplicate(label) {
  return [...list.querySelectorAll('li')].some(
    li => li.firstChild.textContent.trim().toLowerCase() === label.toLowerCase()
  );
}

// ── Add Chapter Button – Click Event Listener ──
button.addEventListener('click', function () {
  clearFeedback();

  // Check input is not blank
  if (input.value.trim() !== '') {

    // Parse and validate input
    const parsed = parseInput(input.value);
    const error = validate(parsed);
    if (error) {
      showFeedback(error);
      input.focus();
      return;
    }

    const label = parsed.label;

    // Prevent duplicates
    if (isDuplicate(label)) {
      showFeedback(`"${label}" is already in your list.`);
      input.focus();
      return;
    }

    // Enforce Top 10 limit
    if (list.children.length >= MAX_CHAPTERS) {
      showFeedback('You\'ve reached the Top 10 limit. Remove one to add another.');
      input.focus();
      return;
    }

    // Create li element
    const li = document.createElement('li');

    // Create delete button
    const deleteButton = document.createElement('button');

    // Populate li with formatted label (not raw input)
    li.textContent = label;

    // Set delete button text and aria-label for accessibility
    deleteButton.textContent = '❌';
    deleteButton.setAttribute('aria-label', 'Remove ' + label);

    // Append delete button to li
    li.append(deleteButton);

    // Append li to the unordered list
    list.append(li);

    // Delete button event listener – removes the li when clicked
    deleteButton.addEventListener('click', function () {
      list.removeChild(li);
      input.focus();
    });

    // Clear the input field
    input.value = '';

    // Return focus to the input field
    input.focus();

  } else {
    // If input is blank, return focus to input
    input.focus();
  }
});

// ── UX: clear feedback as user types ──
input.addEventListener('input', clearFeedback);

// ── UX: allow Enter key to trigger the button ──
input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') button.click();
});