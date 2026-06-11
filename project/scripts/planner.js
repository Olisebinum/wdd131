/**
 * NairaWise — planner.js
 * Budget Planner: calculations, results rendering, localStorage history
 * WDD 131 W06 Project — Olise Ebinum
 */

'use strict';

/* ════════════════════════════════════
   CONSTANTS
════════════════════════════════════ */
const STORAGE_KEY = 'nw_budget_history';
const MAX_HISTORY = 5;

/* ════════════════════════════════════
   HELPERS
════════════════════════════════════ */

/** Format a number as ₦ currency string */
function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;
}

/** Parse a form input value as float, default 0 */
function parseInput(id) {
  const el = document.getElementById(id);
  return el ? Math.max(0, parseFloat(el.value) || 0) : 0;
}

/** Get all saved history entries from localStorage */
function loadHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  try { return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

/** Save a new entry to history (capped at MAX_HISTORY) */
function saveToHistory(entry) {
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.splice(MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/* ════════════════════════════════════
   ANALYTICS ENGINE
════════════════════════════════════ */

/**
 * Calculates a dynamic health score based on savings capacity, 
 * net balance directionality, and essential expenditure balance.
 */
function calculateHealthScore(data) {
  let score = 50;
  score += data.savingsPct;
  if (data.balance > 0) score += 15;
  if (data.needsPct <= 50) score += 15;
  return Math.min(score, 100);
}

/**
 * Extracts the highest single itemized allocation across 
 * structural need and lifestyle want object buckets.
 */
function getLargestExpense(data) {
  const all = {
    ...data.needs,
    ...data.wants
  };
  // FIXED: Correctly targeting array value pairs at index for numerical sorting
  return Object.entries(all)
    .sort((a, b) => b - a);
}

/**
 * Recalculates historical mean statistics across saved user budgets.
 */
function updateHistoryStats() {
  const history = loadHistory();
  const avgEl = document.getElementById('average-savings');
  
  if (!avgEl) return;

  if (!history.length) {
    avgEl.textContent = '';
    return;
  }

  const avg = history.reduce((sum, item) => sum + item.savingsPct, 0) / history.length;
  avgEl.textContent = `Average Savings Rate: ${Math.round(avg)}%`;
}

/* ════════════════════════════════════
   CORE CALCULATION
════════════════════════════════════ */

/**
 * Calculates the full budget breakdown from raw inputs.
 * @returns {Object} breakdown object with all figures
 */
function calculateBudget() {
  const income = parseInput('income');

  // Expense inputs grouped by category
  const needs = {
    'Rent / Housing':   parseInput('rent'),
    'Food & Groceries':  parseInput('food'),
    'Transportation':   parseInput('transport'),
    'Utilities & Data': parseInput('utilities'),
    'Healthcare':       parseInput('health'),
  };
  const wants = {
    'Entertainment': parseInput('entertainment'),
    'Clothing & Care': parseInput('clothing'),
    'Dining Out':     parseInput('dining'),
    'Subscriptions':  parseInput('subscriptions'),
  };

  const totalNeeds  = Object.values(needs).reduce((a, b) => a + b, 0);
  const totalWants  = Object.values(wants).reduce((a, b) => a + b, 0);
  const totalExpenses = totalNeeds + totalWants;
  const balance       = income - totalExpenses;
  const savingsAmt    = Math.max(0, balance);

  // Percentages of income
  const needsPct   = income > 0 ? Math.round((totalNeeds  / income) * 100) : 0;
  const wantsPct   = income > 0 ? Math.round((totalWants  / income) * 100) : 0;
  const savingsPct = income > 0 ? Math.round((savingsAmt / income) * 100) : 0;

  return {
    income,
    needs,
    wants,
    totalNeeds,
    totalWants,
    totalExpenses,
    balance,
    savingsAmt,
    needsPct,
    wantsPct,
    savingsPct,
    date: new Date().toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  };
}

/* ════════════════════════════════════
   STATUS FEEDBACK — Conditional Logic
════════════════════════════════════ */

/**
 * Returns a status object based on budget figures.
 * Uses conditional branching to determine feedback.
 */
function getStatus(data) {
  const { savingsPct, balance, needsPct } = data;

  if (balance < 0) {
    return {
      type: 'poor',
      message: `You are spending ${formatNaira(Math.abs(balance))} more than you earn this month. Review your needs and wants urgently — cut discretionary spending and consider negotiating fixed costs like rent or subscriptions.`,
    };
  }

  if (savingsPct >= 20) {
    return {
      type: 'good',
      message: `Excellent! You are saving ${savingsPct}% of your income — above the recommended 20% target. Consider channelling the surplus into T-Bills, a mutual fund, or building your emergency fund.`,
    };
  }

  if (savingsPct >= 10) {
    return {
      type: 'warn',
      message: `You are saving ${savingsPct}% of your income, which is a healthy start. Aim to reach 20% by gradually reducing discretionary spending. Even ₦5,000 extra per month makes a significant long-term difference.`,
    };
  }

  if (needsPct > 70) {
    return {
      type: 'warn',
      message: `Your essential expenses account for ${needsPct}% of income — above the 50% guideline. Focus on reducing fixed costs where possible (shared housing, cheaper data plan, bulk-buying food) to free up savings capacity.`,
    };
  }

  return {
    type: 'warn',
    message: `Your savings rate is ${savingsPct}%. You have room to improve — try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Small habit changes compound into large financial gains over time.`,
  };
}

/* ════════════════════════════════════
   RENDER VISUALIZATIONS
════════════════════════════════════ */

/** Renders dynamic SVG Donut chart components */
function renderDonutChart(data) {
  const circumference = 314;

  const needsLength = (data.needsPct / 100) * circumference;
  const wantsLength = (data.wantsPct / 100) * circumference;
  const savingsLength = (data.savingsPct / 100) * circumference;

  const needsArc = document.getElementById('donut-needs');
  const wantsArc = document.getElementById('donut-wants');
  const savingsArc = document.getElementById('donut-savings');

  if (!needsArc || !wantsArc || !savingsArc) return;

  needsArc.setAttribute(
    'stroke-dasharray',
    `${needsLength} ${circumference}`
  );

  wantsArc.setAttribute(
    'stroke-dasharray',
    `${wantsLength} ${circumference}`
  );

  wantsArc.setAttribute(
    'stroke-dashoffset',
    `-${needsLength}`
  );

  savingsArc.setAttribute(
    'stroke-dasharray',
    `${savingsLength} ${circumference}`
  );

  savingsArc.setAttribute(
    'stroke-dashoffset',
    `-${needsLength + wantsLength}`
  );

  const donutPct = document.getElementById('donut-pct');
  if (donutPct) {
    donutPct.textContent = `${data.savingsPct}%`;
  }

  const lNeeds = document.getElementById('l-needs');
  const lWants = document.getElementById('l-wants');
  const lSavings = document.getElementById('l-savings');

  if (lNeeds) lNeeds.textContent = `${data.needsPct}%`;
  if (lWants) lWants.textContent = `${data.wantsPct}%`;
  if (lSavings) lSavings.textContent = `${data.savingsPct}%`;
}

function setBarWidth(barId, pct) {
  const bar = document.getElementById(barId);
  if (!bar) return;
  const clamped = Math.min(pct, 100);
  bar.style.width = `${clamped}%`;
  const track = bar.closest('[role="progressbar"]');
  if (track) track.setAttribute('aria-valuenow', String(clamped));
}

/* ════════════════════════════════════
   RENDER RESULTS MAIN
════════════════════════════════════ */

function renderResults(data) {
  // Show results panel
  document.getElementById('results-placeholder')?.classList.add('hidden');
  const content = document.getElementById('results-content');
  if (content) content.classList.add('visible');

  // Summary boxes — using template literals
  const incomeEl   = document.getElementById('r-income');
  const expensesEl = document.getElementById('r-expenses');
  const balanceEl  = document.getElementById('r-balance');
  const savingsEl  = document.getElementById('r-savings');

  if (incomeEl)   incomeEl.textContent   = formatNaira(data.income);
  if (expensesEl) expensesEl.textContent = formatNaira(data.totalExpenses);
  if (balanceEl)  balanceEl.textContent  = formatNaira(data.balance);
  if (savingsEl)  savingsEl.textContent  = `${data.savingsPct}%`;

  // Breakdown bars
  setBarWidth('bar-needs',    data.needsPct);
  setBarWidth('bar-wants',    data.wantsPct);
  setBarWidth('bar-savings',  data.savingsPct);

  // Trigger Donut Graph Metrics
  renderDonutChart(data);

  // Financial Health Score UI Update
  const scoreEl = document.getElementById('health-score');
  if (scoreEl) {
    scoreEl.textContent = `${calculateHealthScore(data)}/100`;
  }

  // FIXED: Correct extraction validation of string keys vs array values
  const largest = getLargestExpense(data);
  const largestEl = document.getElementById('largest-expense');
  if (largestEl && largest && largest > 0) {
    largestEl.textContent = `${largest} (${formatNaira(largest)})`;
  } else if (largestEl) {
    largestEl.textContent = 'None';
  }

  const needsLbl   = document.getElementById('bar-needs-pct');
  const wantsLbl   = document.getElementById('bar-wants-pct');
  const savingsLbl = document.getElementById('bar-savings-pct');
  if (needsLbl)   needsLbl.textContent   = `${data.needsPct}%`;
  if (wantsLbl)   wantsLbl.textContent   = `${data.wantsPct}%`;
  if (savingsLbl) savingsLbl.textContent = `${data.savingsPct}%`;

  // Status message
  const status  = getStatus(data);
  const statusEl = document.getElementById('status-msg');
  if (statusEl) {
    statusEl.className = `status-message ${status.type}`;
    statusEl.textContent = status.message;
  }

  // Recommended split callout
  const recEl = document.getElementById('recommended-split');
  if (recEl && data.income > 0) {
    const rec50 = formatNaira(data.income * 0.5);
    const rec30 = formatNaira(data.income * 0.3);
    const rec20 = formatNaira(data.income * 0.2);
    recEl.innerHTML = `<strong>50/30/20 for your income:</strong> Needs ${rec50} · Wants ${rec30} · Savings ${rec20}`;
  }
}

/* ════════════════════════════════════
   HISTORY — Render Saved Plans
════════════════════════════════════ */

function renderHistory() {
  const list    = document.getElementById('history-list');
  const empty   = document.getElementById('history-empty');
  const history = loadHistory();

  if (!list) return;

  // Process historical descriptive updates
  updateHistoryStats();

  if (!history.length) {
    if (empty) empty.classList.remove('hidden');
    list.innerHTML = '';
    return;
  }
  if (empty) empty.classList.add('hidden');

  // Build list using array method + template literals
  list.innerHTML = history.map(entry => {
    const balClass = entry.balance >= 0 ? 'pos' : 'neg';
    return `
      <li class="history-item">
        <span class="history-date">${entry.date}</span>
        <span class="history-income">${formatNaira(entry.income)}</span>
        <span class="history-balance ${balClass}">
          Balance: ${formatNaira(entry.balance)}
        </span>
        <span class="tag">${entry.savingsPct}% saved</span>
      </li>
    `;
  }).join('');
}

/* ════════════════════════════════════
   CLEAR HISTORY
════════════════════════════════════ */

function initClearHistory() {
  const btn = document.getElementById('clear-history-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Clear all saved budget history?')) return;
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  });
}

/* ════════════════════════════════════
   RESET FORM
════════════════════════════════════ */

function initReset() {
  const btn = document.getElementById('reset-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.getElementById('planner-form')?.reset();
    document.getElementById('results-placeholder')?.classList.remove('hidden');
    document.getElementById('results-content')?.classList.remove('visible');
  });
}

/* ════════════════════════════════════
   FORM SUBMIT
════════════════════════════════════ */

function initPlannerForm() {
  const form = document.getElementById('planner-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = calculateBudget();

    if (data.income <= 0) {
      const incomeInput = document.getElementById('income');
      const incomeError = document.getElementById('income-error');
      if (incomeInput) {
        incomeInput.focus();
        incomeInput.classList.add('invalid');
      }
      if (incomeError) incomeError.style.display = 'block';
      return;
    }

    // Clear any previous income error
    const incomeInput = document.getElementById('income');
    const incomeError = document.getElementById('income-error');
    if (incomeInput) incomeInput.classList.remove('invalid');
    if (incomeError) incomeError.style.display = 'none';

    renderResults(data);
    saveToHistory(data);
    renderHistory();

    // Scroll to results on mobile
    if (window.innerWidth < 768) {
      document.getElementById('results-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

/* ════════════════════════════════════
   INIT
════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initPlannerForm();
  initClearHistory();
  initReset();
  renderHistory();
});