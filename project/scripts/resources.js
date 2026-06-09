/**
 * NairaWise — resources.js
 * Tip filter functionality for Resources page
 * WDD 131 W06 Project — Olise Ebinum
 */

'use strict';

const ALL_TIPS = [
  { cat: 'budgeting', text: 'Categorise every expense the moment you make it — keep a simple notes app or spreadsheet running all month.' },
  { cat: 'budgeting', text: 'Pay yourself first. Treat your savings like a non-negotiable bill that comes out before anything else.' },
  { cat: 'budgeting', text: 'Audit your recurring subscriptions quarterly. Cancel anything you have not used in the past 30 days.' },
  { cat: 'budgeting', text: 'Give every naira a job. Zero-based budgeting means income minus assigned categories equals zero.' },
  { cat: 'saving',    text: 'A money market fund pays significantly more than a regular current account while remaining fully liquid.' },
  { cat: 'saving',    text: 'Set micro-goals: saving ₦1,000 daily is psychologically easier than thinking of ₦30,000 monthly.' },
  { cat: 'saving',    text: 'Maintain a separate "sinking fund" for predictable annual costs: school fees, insurance, or DSTV renewals.' },
  { cat: 'saving',    text: 'Increase your savings rate by 1% each time you receive a salary increase. You will not feel the difference.' },
  { cat: 'investing', text: 'FGN Savings Bonds have a low minimum and are government-backed — a safe entry point for new investors.' },
  { cat: 'investing', text: 'Dollar-denominated Eurobonds can hedge against naira depreciation for medium-term investors.' },
  { cat: 'investing', text: 'REITs (Real Estate Investment Trusts) allow you to invest in property from ₦10,000 on the NGX.' },
  { cat: 'investing', text: 'Never invest money you may need within six months — markets move; liquidity protects you from forced selling.' },
];

function initTipFilter() {
  const grid = document.getElementById('tips-grid');
  const tabs = document.querySelectorAll('.filter-tab');
  if (!grid || !tabs.length) return;

  function renderTips(filter) {
    const filtered = filter === 'all'
      ? ALL_TIPS
      : ALL_TIPS.filter(t => t.cat === filter);

    grid.innerHTML = filtered.map(tip => `
      <article class="tip-card" data-cat="${tip.cat}">
        <p class="tc-cat">${tip.cat}</p>
        <p class="tc-text">${tip.text}</p>
      </article>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTips(tab.dataset.filter);
    });
  });

  renderTips('all');
}

document.addEventListener('DOMContentLoaded', initTipFilter);