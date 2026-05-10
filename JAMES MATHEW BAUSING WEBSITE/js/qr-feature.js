/* ============================================================
   QR Code Feature — Matthew Bausing Portfolio
   Uses qrcode.js CDN library
   ============================================================ */

(function () {
  'use strict';

  const PORTFOLIO_URL = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/') + 'index.html';

  /* ── Generate QR into a canvas inside a given container ── */
  function generateQR(containerId, size = 180) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    if (typeof QRCode === 'undefined') {
      container.innerHTML = '<p style="color:var(--accent-cyan);font-size:0.8rem;text-align:center;">Loading QR…</p>';
      return;
    }

    new QRCode(container, {
      text: PORTFOLIO_URL,
      width: size,
      height: size,
      colorDark: '#00f5ff',
      colorLight: '#050810',
      correctLevel: QRCode.CorrectLevel.H,
    });

    /* Style the generated canvas/img */
    const el = container.querySelector('canvas') || container.querySelector('img');
    if (el) {
      el.style.borderRadius = '12px';
      el.style.display = 'block';
      el.style.margin = '0 auto';
    }
  }

  /* ── Download QR as PNG ── */
  function downloadQR(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const canvas = container.querySelector('canvas');
    const img    = container.querySelector('img');

    if (canvas) {
      const link = document.createElement('a');
      link.download = 'matthew-bausing-portfolio-qr.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else if (img) {
      const link = document.createElement('a');
      link.download = 'matthew-bausing-portfolio-qr.png';
      link.href = img.src;
      link.click();
    }
  }

  /* ── Floating QR Button (injected into every page) ── */
  function injectFloatingQR() {
    // Build overlay
    const overlay = document.createElement('div');
    overlay.id = 'qr-overlay';
    overlay.innerHTML = `
      <div class="qr-popup-card" id="qr-popup-card">
        <div class="qr-popup-header">
          <span class="qr-popup-label">// SCAN TO VISIT</span>
          <button class="qr-popup-close" id="qr-popup-close" aria-label="Close QR">✕</button>
        </div>
        <div class="qr-popup-body" id="qr-float-canvas"></div>
        <p class="qr-popup-url">${PORTFOLIO_URL}</p>
        <button class="qr-download-btn" onclick="window.__downloadFloatQR()">⬇ Download QR</button>
      </div>
    `;
    document.body.appendChild(overlay);

    // Build floating button
    const btn = document.createElement('button');
    btn.id = 'qr-float-btn';
    btn.setAttribute('aria-label', 'Show QR Code');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <path d="M14 14h2v2h-2zM18 14h3v2h-3zM14 18h2v3h-2zM18 18h3v3h-3z"/>
    </svg>`;
    document.body.appendChild(btn);

    let popupOpen = false;
    let generated = false;

    btn.addEventListener('click', () => {
      popupOpen = !popupOpen;
      overlay.classList.toggle('visible', popupOpen);
      btn.classList.toggle('active', popupOpen);
      if (popupOpen && !generated) {
        requestAnimationFrame(() => {
          generateQR('qr-float-canvas', 160);
          generated = true;
        });
      }
    });

    document.getElementById('qr-popup-close').addEventListener('click', () => {
      popupOpen = false;
      overlay.classList.remove('visible');
      btn.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        popupOpen = false;
        overlay.classList.remove('visible');
        btn.classList.remove('active');
      }
    });

    window.__downloadFloatQR = () => downloadQR('qr-float-canvas');
  }

  /* ── Public API ── */
  window.QRFeature = { generateQR, downloadQR, injectFloatingQR };

  /* ── Auto-init floating button when DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFloatingQR);
  } else {
    injectFloatingQR();
  }

  /* ── Re-generate if QRCode lib loads late ── */
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      if (typeof QRCode !== 'undefined') {
        /* refresh contact page QR if element exists */
        const cEl = document.getElementById('contact-qr-canvas');
        if (cEl && cEl.innerHTML.trim() === '') generateQR('contact-qr-canvas', 180);
      }
    }, 500);
  });
})();
