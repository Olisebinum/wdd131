// ── BOM Top 10 – DOM References ──
const input = document.querySelector('#favchap');
const button = document.querySelector('button');
const list = document.querySelector('#list');

// ── Set current year in footer ──
const yearSpan = document.querySelector('#currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ── Add Chapter Button – Click Event Listener ──
button.addEventListener('click', function () {

  // Check input is not blank
  if (input.value.trim() !== '') {

    // Create li element
    const li = document.createElement('li');

    // Create delete button
    const deleteButton = document.createElement('button');

    // Populate li with input value
    li.textContent = input.value;

    // Set delete button text and aria-label for accessibility
    deleteButton.textContent = '❌';
    deleteButton.setAttribute('aria-label', 'Remove ' + input.value);

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