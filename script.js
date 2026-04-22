/* ============================================================
   KING LOTTERY - Main JavaScript
   All interactions, animations, admin panel, countdown
   ============================================================ */

'use strict';

// ============================================================
// LOTTERY DATA — Edit this to update results on the site
// ============================================================
const LOTTERY_DATA = {
  jackpot: 14750000,
  nextDrawDate: (() => {
    // Next draw at 6 PM today or tomorrow
    const d = new Date();
    d.setHours(18, 0, 0, 0);
    if (d < new Date()) d.setDate(d.getDate() + 1);
    return d;
  })(),

  // Daily results — time: result number
  dailyResults: {
    "KING MORNING": [
      { time: "10:00 AM", number: "47", label: "OPEN" },
      { time: "10:30 AM", number: "23", label: "JODI" },
      { time: "11:00 AM", number: "71", label: "CLOSE" },
    ],
    "KING AFTERNOON": [
      { time: "01:00 PM", number: "59", label: "OPEN" },
      { time: "01:30 PM", number: "85", label: "JODI" },
      { time: "02:00 PM", number: "36", label: "CLOSE" },
    ],
    "KING EVENING": [
      { time: "04:00 PM", number: "12", label: "OPEN" },
      { time: "04:30 PM", number: "64", label: "JODI" },
      { time: "05:00 PM", number: "38", label: "CLOSE" },
    ],
    "ROYAL NIGHT": [
      { time: "08:00 PM", number: "91", label: "OPEN" },
      { time: "08:30 PM", number: "27", label: "JODI" },
      { time: "09:00 PM", number: "54", label: "CLOSE" },
    ],
    "KING GOLD": [
      { time: "11:00 PM", number: "66", label: "OPEN" },
      { time: "11:30 PM", number: "43", label: "JODI" },
      { time: "12:00 AM", number: "08", label: "CLOSE" },
    ],
  },

  // Chart data
  chartData: [
    { date: "22 Apr", mon: "47", tue: "23", wed: "91", thu: "15", fri: "38", sat: "72", sun: "56" },
    { date: "21 Apr", mon: "35", tue: "87", wed: "42", thu: "69", fri: "14", sat: "28", sun: "91" },
    { date: "20 Apr", mon: "62", tue: "44", wed: "17", thu: "83", fri: "55", sat: "39", sun: "07" },
    { date: "19 Apr", mon: "78", tue: "31", wed: "66", thu: "22", fri: "49", sat: "85", sun: "13" },
    { date: "18 Apr", mon: "11", tue: "58", wed: "34", thu: "76", fri: "92", sat: "47", sun: "60" },
    { date: "17 Apr", mon: "25", tue: "63", wed: "89", thu: "17", fri: "41", sat: "54", sun: "36" },
    { date: "16 Apr", mon: "50", tue: "77", wed: "28", thu: "94", fri: "63", sat: "18", sun: "72" },
  ],

  // Winning history
  winners: [
    { date: "22 Apr 2026", game: "KING GOLD",    numbers: "66-43-08", prize: "₹2,50,000", winner: "R***j S." },
    { date: "21 Apr 2026", game: "ROYAL NIGHT",  numbers: "91-27-54", prize: "₹1,80,000", winner: "M***i K." },
    { date: "21 Apr 2026", game: "KING EVENING", numbers: "12-64-38", prize: "₹90,000",   winner: "S***n P." },
    { date: "20 Apr 2026", game: "KING MORNING", numbers: "62-44-17", prize: "₹3,20,000", winner: "A***h D." },
    { date: "20 Apr 2026", game: "KING AFTERNOON",numbers:"35-87-42", prize: "₹1,10,000", winner: "P***l N." },
    { date: "19 Apr 2026", game: "KING GOLD",    numbers: "78-31-66", prize: "₹4,50,000", winner: "V***s R." },
    { date: "19 Apr 2026", game: "ROYAL NIGHT",  numbers: "22-49-85", prize: "₹2,00,000", winner: "K***r T." },
  ],

  // Latest winner for popup
  latestWinner: { name: "Raj***", city: "Mumbai", game: "KING GOLD", amount: "₹2,50,000", time: "2 minutes ago" },

  // Ticker messages
  ticker: [
    { label: "KING MORNING", numbers: "47 • 23 • 71" },
    { label: "KING AFTERNOON", numbers: "59 • 85 • 36" },
    { label: "KING EVENING", numbers: "12 • 64 • 38" },
    { label: "ROYAL NIGHT", numbers: "91 • 27 • 54" },
    { label: "KING GOLD", numbers: "66 • 43 • 08" },
    { label: "JACKPOT", numbers: "₹1,47,50,000 TODAY" },
  ],

  // Hot / Cold numbers
  hotNumbers: [7, 14, 23, 36, 47, 59, 66, 72, 85, 91],
  coldNumbers: [3, 11, 18, 25, 33, 44, 50, 63, 77, 89],
  warmNumbers: [9, 19, 28, 37, 48, 55, 70, 81, 94],
};

// ============================================================
// UTILS
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const fmt = n => n.toString().padStart(2, '0');

// ============================================================
// NAVBAR — scroll behavior
// ============================================================
function initNavbar() {
  const nav = $('#mainNav');
  if (!nav) return;
  const handler = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', handler, { passive: true });
  handler();

  // Active link highlight
  const path = window.location.pathname.split('/').pop() || 'index.html';
  $$('.navbar-nav .nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
}

// ============================================================
// TICKER
// ============================================================
function initTicker() {
  const track = $('#tickerTrack');
  if (!track) return;
  const items = LOTTERY_DATA.ticker;
  const html = [...items, ...items].map(t =>
    `<span class="ticker-item">
      <span class="ticker-item__game" style="font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,215,0,0.6)">${t.label}</span>
      <span class="separator">|</span>
      <span class="num">${t.numbers}</span>
    </span>`
  ).join('');
  track.innerHTML = html;
}

// ============================================================
// JACKPOT COUNTER — animated count up
// ============================================================
function animateCounter(el, target, prefix = '₹', suffix = '') {
  if (!el) return;
  let start = 0;
  const duration = 2500;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = prefix + Math.floor(start).toLocaleString('en-IN') + suffix;
  }, 16);
}

function initJackpot() {
  const el = $('#jackpotAmount');
  if (el) animateCounter(el, LOTTERY_DATA.jackpot, '₹');
}

// ============================================================
// STATS BAR COUNTERS
// ============================================================
function initStats() {
  const stats = [
    { id: 'statWinners', target: 15842, prefix: '', suffix: '+' },
    { id: 'statPaid',    target: 8500000, prefix: '₹', suffix: '+' },
    { id: 'statGames',   target: 5, prefix: '', suffix: '' },
    { id: 'statMembers', target: 250000, prefix: '', suffix: '+' },
  ];
  stats.forEach(s => animateCounter(document.getElementById(s.id), s.target, s.prefix, s.suffix));
}

// ============================================================
// DAILY RESULTS GRID
// ============================================================
function renderDailyResults() {
  const container = $('#dailyResultsContainer');
  if (!container) return;

  let html = '';
  for (const [cat, results] of Object.entries(LOTTERY_DATA.dailyResults)) {
    html += `
      <div class="result-category reveal">
        <div class="result-cat-title">
          ${cat}
          <span class="badge-live">● LIVE</span>
        </div>
        <div class="result-grid">
          ${results.map(r => `
            <div class="result-item">
              <div class="time">${r.time}</div>
              <div class="number">${r.number}</div>
              <div class="label">${r.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
  initReveal(); // re-scan for new reveal elements
}

// ============================================================
// NUMBER GRID
// ============================================================
function renderNumberGrid() {
  const wrap = $('#numberBallsWrap');
  if (!wrap) return;
  let html = '';
  for (let i = 1; i <= 99; i++) {
    let cls = 'number-ball';
    if (LOTTERY_DATA.hotNumbers.includes(i)) cls += ' hot';
    else if (LOTTERY_DATA.coldNumbers.includes(i)) cls += ' cold';
    else if (LOTTERY_DATA.warmNumbers.includes(i)) cls += ' warm';
    html += `<div class="${cls}" title="Number ${i}">${fmt(i)}</div>`;
  }
  wrap.innerHTML = html;
}

// ============================================================
// CHART TABLE
// ============================================================
function renderChart() {
  const body = $('#chartTableBody');
  if (!body) return;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  body.innerHTML = LOTTERY_DATA.chartData.map((row, i) => `
    <tr class="reveal" style="transition-delay:${i * 0.05}s">
      <td style="color:var(--gold-dark);font-weight:600">${row.date}</td>
      <td><span class="winner-num">${row.mon}</span></td>
      <td><span class="winner-num">${row.tue}</span></td>
      <td><span class="winner-num">${row.wed}</span></td>
      <td><span class="winner-num">${row.thu}</span></td>
      <td><span class="winner-num">${row.fri}</span></td>
      <td><span class="winner-num">${row.sat}</span></td>
      <td><span class="winner-num">${row.sun}</span></td>
    </tr>
  `).join('');
  initReveal();
}

// ============================================================
// WINNING HISTORY TABLE
// ============================================================
function renderHistory() {
  const body = $('#historyTableBody');
  if (!body) return;
  body.innerHTML = LOTTERY_DATA.winners.map((w, i) => `
    <tr class="reveal" style="transition-delay:${i * 0.07}s">
      <td>${w.date}</td>
      <td style="color:var(--text-primary)">${w.game}</td>
      <td><span class="badge-gold">${w.numbers}</span></td>
      <td style="color:var(--gold);font-weight:700;font-family:var(--font-display)">${w.prize}</td>
      <td>${w.winner}</td>
    </tr>
  `).join('');
  initReveal();
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown() {
  const daysEl  = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl  = document.getElementById('cdMins');
  const secsEl  = document.getElementById('cdSecs');
  if (!secsEl) return;

  function tick(box, newVal) {
    if (box.textContent !== newVal) {
      box.classList.remove('tick');
      void box.offsetWidth; // reflow
      box.classList.add('tick');
      box.textContent = newVal;
    }
  }

  function update() {
    const now = new Date();
    let diff = Math.max(0, LOTTERY_DATA.nextDrawDate - now) / 1000;
    const d = Math.floor(diff / 86400); diff -= d * 86400;
    const h = Math.floor(diff / 3600); diff -= h * 3600;
    const m = Math.floor(diff / 60);
    const s = Math.floor(diff % 60);
    tick(daysEl, fmt(d));
    tick(hoursEl, fmt(h));
    tick(minsEl, fmt(m));
    tick(secsEl, fmt(s));
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// WINNER POPUP
// ============================================================
function initPopup() {
  const popup = $('#winnerPopup');
  if (!popup) return;
  const w = LOTTERY_DATA.latestWinner;

  popup.querySelector('#popupName').textContent = w.name + ' from ' + w.city;
  popup.querySelector('#popupGame').textContent = w.game;
  popup.querySelector('#popupAmount').textContent = w.amount;
  popup.querySelector('#popupTime').textContent = w.time;

  // Show after 4 seconds
  setTimeout(() => popup.classList.add('show'), 4000);
  // Auto hide after 10 seconds
  setTimeout(() => popup.classList.remove('show'), 10000);

  // Close button
  popup.querySelector('#popupClose').addEventListener('click', () => {
    popup.classList.remove('show');
  });
}

// ============================================================
// ADMIN PANEL
// ============================================================
function initAdminPanel() {
  const panel = document.getElementById('adminPanel');
  const toggle = document.getElementById('adminToggle');
  const closeBtn = document.getElementById('adminClose');
  if (!panel || !toggle) return;

  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  // Populate form with current data
  const jackpotInput = document.getElementById('adminJackpot');
  if (jackpotInput) jackpotInput.value = LOTTERY_DATA.jackpot.toLocaleString('en-IN');

  // Handle result update
  document.getElementById('adminUpdateBtn')?.addEventListener('click', () => {
    const game = document.getElementById('adminGame').value;
    const t = document.getElementById('adminTime').value;
    const num = document.getElementById('adminNumber').value;
    const lbl = document.getElementById('adminLabel').value;

    if (!game || !t || !num) { showAdminMsg('Please fill all fields', 'error'); return; }

    // Update the data
    if (LOTTERY_DATA.dailyResults[game]) {
      const existing = LOTTERY_DATA.dailyResults[game].find(r => r.time === t);
      if (existing) { existing.number = num; existing.label = lbl; }
      else LOTTERY_DATA.dailyResults[game].push({ time: t, number: num, label: lbl });
    }

    renderDailyResults();
    showAdminMsg('✓ Result updated successfully!', 'success');
  });

  // Jackpot update
  document.getElementById('adminJackpotBtn')?.addEventListener('click', () => {
    const val = parseInt(document.getElementById('adminJackpot').value.replace(/,/g, ''));
    if (isNaN(val)) { showAdminMsg('Invalid jackpot amount', 'error'); return; }
    LOTTERY_DATA.jackpot = val;
    initJackpot();
    showAdminMsg('✓ Jackpot updated!', 'success');
  });

  function showAdminMsg(msg, type) {
    const el = document.getElementById('adminMsg');
    if (!el) return;
    el.textContent = msg;
    el.style.color = type === 'success' ? 'var(--gold)' : '#ff6b6b';
    el.style.opacity = 1;
    setTimeout(() => (el.style.opacity = 0), 3000);
  }

  // Populate game select
  const sel = document.getElementById('adminGame');
  if (sel) {
    Object.keys(LOTTERY_DATA.dailyResults).forEach(g => {
      const opt = document.createElement('option');
      opt.value = g; opt.textContent = g;
      sel.appendChild(opt);
    });
  }
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  } else {
    els.forEach(el => el.classList.add('visible'));
  }
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    const orig = btn.textContent;
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#4caf50,#2e7d32)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3500);
  });
}

// ============================================================
// SMOOTH SCROLL for anchor links
// ============================================================
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav
        const navCollapse = document.getElementById('navCollapse');
        if (navCollapse?.classList.contains('show')) {
          document.querySelector('.navbar-toggler')?.click();
        }
      }
    });
  });
}

// ============================================================
// TABS (results page)
// ============================================================
function initResultTabs() {
  $$('.result-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.result-tab-btn').forEach(b => b.classList.remove('active'));
      $$('.result-tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.target);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================================
// REGISTER FORM VALIDATION
// ============================================================
function initAuthForms() {
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const pass = document.getElementById('regPassword')?.value;
      const conf = document.getElementById('regConfirm')?.value;
      if (pass !== conf) {
        showFormError('Passwords do not match!');
        return;
      }
      showFormSuccess('Account created! Redirecting to login...');
      setTimeout(() => { window.location.href = 'login.html'; }, 2000);
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      showFormSuccess('Login successful! Welcome back.');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    });
  }

  function showFormError(msg) {
    let el = document.getElementById('formMsg');
    if (!el) { el = document.createElement('div'); el.id = 'formMsg'; document.querySelector('.auth-card').prepend(el); }
    el.className = 'alert'; el.style.cssText = 'background:rgba(255,50,50,0.1);border:1px solid #ff4444;color:#ff6b6b;padding:12px 16px;border-radius:6px;margin-bottom:1rem;font-size:0.85rem;';
    el.textContent = msg;
  }

  function showFormSuccess(msg) {
    let el = document.getElementById('formMsg');
    if (!el) { el = document.createElement('div'); el.id = 'formMsg'; document.querySelector('.auth-card').prepend(el); }
    el.className = 'alert'; el.style.cssText = 'background:rgba(255,215,0,0.08);border:1px solid var(--gold);color:var(--gold);padding:12px 16px;border-radius:6px;margin-bottom:1rem;font-size:0.85rem;';
    el.textContent = msg;
  }
}

// ============================================================
// TICKER for home — build live ticker from data
// ============================================================
function buildTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const all = [];
  LOTTERY_DATA.ticker.forEach(t => {
    all.push(`<span class="ticker-item">
      <span style="font-size:0.68rem;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,215,0,0.55)">${t.label}</span>
      <span class="separator"> ❯ </span>
      <span class="num">${t.numbers}</span>
    </span>`);
  });
  track.innerHTML = [...all, ...all].join('');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  buildTicker();
  initJackpot();
  initStats();
  renderDailyResults();
  renderNumberGrid();
  renderChart();
  renderHistory();
  initCountdown();
  initPopup();
  initAdminPanel();
  initReveal();
  initContactForm();
  initSmoothScroll();
  initResultTabs();
  initAuthForms();
});
