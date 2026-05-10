/* ============================================================
   Music Player — "Best Part" by Daniel Caesar ft. H.E.R.
   Matthew Bausing Portfolio
   ============================================================ */

(function () {
  'use strict';

  function initMusicPlayer() {
    const audio       = document.getElementById('bp-audio');
    const playBtn     = document.getElementById('bp-play');
    const progress    = document.getElementById('bp-progress');
    const progressFill = document.getElementById('bp-progress-fill');
    const progressThumb = document.getElementById('bp-progress-thumb');
    const currentTime = document.getElementById('bp-current');
    const duration    = document.getElementById('bp-duration');
    const volSlider   = document.getElementById('bp-volume');
    const volIcon     = document.getElementById('bp-vol-icon');
    const vizBars     = document.querySelectorAll('.bp-viz-bar');
    const playerCard  = document.getElementById('music-player-card');

    if (!audio || !playBtn) return;

    let isDragging = false;

    /* ── Format mm:ss ── */
    function fmt(s) {
      if (isNaN(s)) return '0:00';
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60);
      return `${m}:${sec.toString().padStart(2, '0')}`;
    }

    /* ── Visualizer animation ── */
    function startViz() {
      playerCard && playerCard.classList.add('playing');
      vizBars.forEach((bar, i) => {
        bar.style.animationPlayState = 'running';
        bar.style.animationDelay = `${i * 0.12}s`;
      });
    }

    function stopViz() {
      playerCard && playerCard.classList.remove('playing');
      vizBars.forEach(bar => {
        bar.style.animationPlayState = 'paused';
        bar.style.height = '6px';
      });
    }

    /* ── Play / Pause ── */
    function togglePlay() {
      if (audio.paused) {
        audio.play().then(startViz).catch(() => {});
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>`;
      } else {
        audio.pause();
        stopViz();
        playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <polygon points="5,3 19,12 5,21"/>
        </svg>`;
      }
    }

    playBtn.addEventListener('click', togglePlay);

    /* ── Progress bar ── */
    audio.addEventListener('timeupdate', () => {
      if (isDragging) return;
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      progressThumb.style.left = pct + '%';
      currentTime.textContent = fmt(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      duration.textContent = fmt(audio.duration);
    });

    audio.addEventListener('ended', () => {
      stopViz();
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <polygon points="5,3 19,12 5,21"/>
      </svg>`;
      progressFill.style.width = '0%';
      progressThumb.style.left = '0%';
    });

    /* ── Seek ── */
    function seek(e) {
      const rect = progress.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      audio.currentTime = pct * audio.duration;
      progressFill.style.width = (pct * 100) + '%';
      progressThumb.style.left = (pct * 100) + '%';
    }

    progress.addEventListener('mousedown', (e) => { isDragging = true; seek(e); });
    document.addEventListener('mousemove', (e) => { if (isDragging) seek(e); });
    document.addEventListener('mouseup', () => { isDragging = false; });
    progress.addEventListener('touchstart', (e) => { isDragging = true; seek(e); }, { passive: true });
    document.addEventListener('touchmove', (e) => { if (isDragging) seek(e); }, { passive: true });
    document.addEventListener('touchend', () => { isDragging = false; });

    /* ── Volume ── */
    audio.volume = volSlider ? volSlider.value / 100 : 0.8;

    if (volSlider) {
      volSlider.addEventListener('input', () => {
        audio.volume = volSlider.value / 100;
        if (volIcon) {
          if (audio.volume === 0) volIcon.textContent = '🔇';
          else if (audio.volume < 0.5) volIcon.textContent = '🔉';
          else volIcon.textContent = '🔊';
        }
        /* update slider fill */
        volSlider.style.setProperty('--vol-pct', volSlider.value + '%');
      });
      volSlider.style.setProperty('--vol-pct', '80%');
    }

    if (volIcon) {
      volIcon.addEventListener('click', () => {
        audio.muted = !audio.muted;
        volIcon.textContent = audio.muted ? '🔇' : (audio.volume < 0.5 ? '🔉' : '🔊');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPlayer);
  } else {
    initMusicPlayer();
  }
})();
