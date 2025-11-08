// main.js - controls lyric highlighting, scrolling and the auto-scroll toggle.
// This file is loaded with <script src="main.js" defer></script> in index.html.

(function () {
    const audio = document.getElementById('audio');
    const lyricsBox = document.getElementById('lyrics-box');
    const lines = Array.from(lyricsBox.querySelectorAll('.lyric'));
    // Read timestamps from data-start attributes (seconds as floats)
    const starts = lines.map(l => {
      const ds = l.dataset.start;
      return ds ? parseFloat(ds) : null;
    });
  
    // Auto-scroll state (default true). Persist preference in localStorage so it survives reloads.
    const AUTO_KEY = 'lyrics_auto_scroll';
    let autoScrollEnabled = (() => {
      try {
        const v = localStorage.getItem(AUTO_KEY);
        return v === null ? true : v === '1';
      } catch (e) {
        return true;
      }
    })();
  
    // Wire up push-button UI
    const autoBtn = document.getElementById('auto-toggle-btn');
  
    function updateButtonState() {
      if (!autoBtn) return;
      autoBtn.setAttribute('aria-pressed', autoScrollEnabled ? 'true' : 'false');
      autoBtn.classList.toggle('on', !!autoScrollEnabled);
      autoBtn.textContent = autoScrollEnabled ? 'Auto-scroll: On' : 'Auto-scroll: Off';
    }
  
    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        autoScrollEnabled = !autoScrollEnabled;
        try { localStorage.setItem(AUTO_KEY, autoScrollEnabled ? '1' : '0'); } catch (e) {}
        updateButtonState();
      });
    }
  
    // initialize button
    updateButtonState();
  
    let currentIndex = -1;
  
    // Helper: center an element in the viewport smoothly
    function centerElementInViewport(el) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const delta = elCenter - viewportCenter;
      if (Math.abs(delta) > 2) {
        window.scrollBy({ top: delta, left: 0, behavior: 'smooth' });
      }
    }
  
    // Find the active lyric based on current time and update highlight + scrolling
    function update(currentTime) {
      if (!starts || starts.length === 0) return;
      let idx = -1;
      for (let i = 0; i < starts.length; i++) {
        if (starts[i] !== null && starts[i] <= currentTime) idx = i;
        else if (starts[i] === null) break;
      }
      setActive(idx);
    }
  
    function setActive(idx) {
      if (idx === currentIndex) return;
  
      // remove previous glow
      if (currentIndex >= 0 && currentIndex < lines.length) {
        lines[currentIndex].classList.remove('glow');
      }
  
      currentIndex = idx;
  
      if (currentIndex >= 0 && currentIndex < lines.length) {
        const el = lines[currentIndex];
        el.classList.add('glow');
  
        // Only perform scrolling when auto-scroll is enabled.
        if (autoScrollEnabled) {
          // Scroll the lyrics container so the line is centered inside it
          try {
            const boxRect = lyricsBox.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();
            const offset = (elRect.top + elRect.bottom) / 2 - (boxRect.top + boxRect.bottom) / 2;
            lyricsBox.scrollBy({ top: offset, left: 0, behavior: 'smooth' });
          } catch (e) {
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
  
          // Also center the element in the window viewport when appropriate
          const boxHeight = lyricsBox.getBoundingClientRect().height;
          if (boxHeight < window.innerHeight * 0.85) {
            centerElementInViewport(el);
          } else {
            const r = el.getBoundingClientRect();
            if (r.bottom < 0 || r.top > window.innerHeight) {
              centerElementInViewport(el);
            }
          }
        }
      }
    }
  
    // Seek to a line's timestamp when clicked; if no timestamp, jump proportionally
    lines.forEach((line, i) => {
      line.style.cursor = 'pointer';
      line.addEventListener('click', () => {
        if (starts[i] !== null && isFinite(starts[i])) {
          audio.currentTime = starts[i];
        } else if (audio.duration && isFinite(audio.duration)) {
          audio.currentTime = (i / Math.max(lines.length - 1, 1)) * audio.duration;
        }
        if (audio.paused) audio.play().catch(()=>{});
      });
    });
  
    // Update highlight during playback
    if (audio) {
      audio.addEventListener('timeupdate', () => {
        update(audio.currentTime);
      });
  
      audio.addEventListener('ended', () => {
        setActive(-1);
      });
  
      // Initialize highlighting state from the current time (in case audio is already playing)
      if (!audio.paused) {
        update(audio.currentTime);
      }
    }
  })();