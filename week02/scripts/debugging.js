// ── Debugging Activity – Fixed JavaScript ──

// Get references to the HTML span elements where output will be displayed
const radiusOutput = document.getElementById('radius');
const areaOutput = document.getElementById('area');

// Initialize area variable using let since its value will change
let area = 0;

// PI is a constant value that never changes
const PI = 3.14159;

// Fix 1: Changed 'const' to 'let' so radius can be reassigned later
let radius = 10;

// Calculate area of circle: PI * r²
area = PI * radius * radius;

// Use textContent (preferred over innerHTML) to safely display values in the spans
radiusOutput.textContent = radius;
areaOutput.textContent = area;

// Fix 2: Removed duplicate 'let' declaration — radius is already declared above
// Just reassign the value directly
radius = 20;

// Recalculate area with the new radius
area = PI * radius * radius;

// Fix 3: Changed innerHTML to textContent — textContent is safer and preferred
// since we are only displaying plain numbers, not HTML
radiusOutput.textContent = radius;
areaOutput.textContent = area;