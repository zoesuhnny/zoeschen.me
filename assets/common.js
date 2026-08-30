/* ============================================================
   SHARED ACROSS ALL 5 LAYOUTS
   Two independent features: the mouse-follower dot, and the
   text-scramble-on-hover effect. Both skip themselves on touch
   devices automatically.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initScramble();
});

/* ---------- Cursor follower ---------- */
function initCursor() {
  const dot = document.getElementById('cursor');
  const label = document.getElementById('cursor-label');
  if (!dot || !label) return;
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let x = 0, y = 0, targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function loop() {
    // Lerp toward the real mouse position for a slight trailing feel.
    x += (targetX - x) * 0.25;
    y += (targetY - y) * 0.25;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      label.textContent = el.getAttribute('data-cursor') || '';
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      label.textContent = '';
    });
  });
}

/* ---------- Text scramble / glitch on hover ---------- */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%&';

function scrambleEl(el) {
  const original = el.dataset.scramble ?? el.textContent ?? '';
  let frame = 0;
  const totalFrames = original.length * 3;

  if (el._scrambleTimer) clearInterval(el._scrambleTimer);

  el._scrambleTimer = setInterval(() => {
    el.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < frame / 3) return original[i];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    frame += 1;
    if (frame >= totalFrames) {
      el.textContent = original;
      clearInterval(el._scrambleTimer);
    }
  }, 30);
}

function initScramble() {
  document.querySelectorAll('[data-scramble]').forEach((el) => {
    el.dataset.scramble = el.textContent ?? '';
    el.addEventListener('mouseenter', () => scrambleEl(el));
  });
}

/* Optional: trigger a scramble on an element automatically, used by
   Layout 4 for the ambient idle-glitch on the centered name. */
function ambientScramble(selector, everyMs) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.dataset.scramble = el.textContent ?? '';
  setInterval(() => scrambleEl(el), everyMs);
}
