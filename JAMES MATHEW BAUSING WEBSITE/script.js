/* ============================================================
   Matthew Bausing Portfolio — script.js (Enhanced)
   Features: Dark Mode, Login Guard, Search, Animations
   ============================================================ */

// ── Page Data for Search ──
const PAGES = [
  { name: 'Home',    href: 'index.html',    icon: '🏠', keywords: ['home', 'main', 'intro', 'welcome'] },
  { name: 'About',   href: 'about.html',    icon: '👤', keywords: ['about', 'info', 'personal', 'profile', 'birthday', 'age'] },
  { name: 'Resume',  href: 'resume.html',   icon: '📄', keywords: ['resume', 'cv', 'skills', 'education', 'experience', 'objective'] },
  { name: 'Hobbies', href: 'hobbies.html',  icon: '🎮', keywords: ['hobbies', 'gaming', 'anime', 'mobile legends', 'cote', 'classroom'] },
  { name: 'Contact', href: 'contact.html',  icon: '✉️', keywords: ['contact', 'email', 'message', 'reach', 'gmail', 'facebook'] },
];

// ── Dark Mode ──
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  if (!toggle) return;

  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);

  toggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  const toggle = document.getElementById('dark-mode-toggle');
  if (toggle) {
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    toggle.title = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
  }
}

// ── Login Guard ──
const PUBLIC_PAGES = ['login.html'];

function isLoggedIn() {
  return localStorage.getItem('mb_logged_in') === 'true';
}

function checkLoginGuard() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (PUBLIC_PAGES.includes(page)) return;
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('mb_logged_in');
  window.location.href = 'login.html';
}

// ── Active Nav Link ──
function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Search Functionality ──
function initSearch() {
  const input    = document.getElementById('nav-search-input');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) { dropdown.classList.remove('visible'); dropdown.innerHTML = ''; return; }

    const results = PAGES.filter(page =>
      page.name.toLowerCase().includes(query) ||
      page.keywords.some(kw => kw.includes(query))
    );

    dropdown.innerHTML = results.length === 0
      ? `<div class="no-results">No pages found for "${query}"</div>`
      : results.map(p => `<a class="search-result-item" href="${p.href}"><span class="result-icon">${p.icon}</span><span>${p.name}</span></a>`).join('');

    dropdown.classList.add('visible');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) dropdown.classList.remove('visible');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const first = dropdown.querySelector('.search-result-item');
      if (first) window.location.href = first.getAttribute('href');
    }
    if (e.key === 'Escape') { dropdown.classList.remove('visible'); input.blur(); }
  });
}

// ── Mobile Hamburger ──
function initHamburger() {
  const burger   = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Intersection Observer Animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ── Typewriter Effect ──
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const texts = el.dataset.texts ? JSON.parse(el.dataset.texts) : [el.textContent];
  let textIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = texts[textIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) { deleting = false; textIdx = (textIdx + 1) % texts.length; charIdx = 0; }
      setTimeout(tick, 60);
    } else {
      el.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) { deleting = true; setTimeout(tick, 1800); return; }
      setTimeout(tick, 80);
    }
  }
  tick();
}

// ── Contact Form ──
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '✓ MESSAGE SENT';
    btn.style.background = 'rgba(0, 245, 255, 0.15)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}

// ── Skill Bar Animations ──
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => { bar.style.width = '0'; observer.observe(bar); });
}

// ── Init All ──
document.addEventListener('DOMContentLoaded', () => {
  checkLoginGuard();
  initDarkMode();
  setActiveNav();
  initSearch();
  initHamburger();
  initScrollAnimations();
  initTypewriter();
  initContactForm();
  initSkillBars();
});
