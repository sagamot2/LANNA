const root = document.documentElement;
const modeIcon = document.getElementById('modeIcon');

function applyMode(mode) {
  root.setAttribute('data-mode', mode);
  if (modeIcon) modeIcon.textContent = mode === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('gus-mode', mode);
}

function toggleMode() {
  const current = root.getAttribute('data-mode');
  applyMode(current === 'dark' ? 'light' : 'dark');
}

applyMode(localStorage.getItem('gus-mode') || 'dark');

const drawer = document.getElementById('drawer');

function toggleDrawer() {
  if (drawer) drawer.classList.toggle('open');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.ham-btn') && !e.target.closest('.drawer')) {
    if (drawer) drawer.classList.remove('open');
  }
});

const music = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicBtn = document.getElementById('musicBtn');

function setMusicUI(playing) {
  if (musicIcon) musicIcon.textContent = playing ? '♪' : '♫';
  if (musicBtn) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }
}

function toggleMusic() {
  if (!music) return;
  if (music.paused) {
    music.volume = 0.35;
    music.play().catch(() => {});
    localStorage.setItem('gus-music', 'on');
  } else {
    music.pause();
    localStorage.setItem('gus-music', 'off');
  }
}

if (music) {
  music.addEventListener('play', () => setMusicUI(true));
  music.addEventListener('pause', () => setMusicUI(false));
  if (localStorage.getItem('gus-music') === 'on') {
    const resume = () => {
      music.volume = 0.35;
      music.play().catch(() => {});
      document.removeEventListener('click', resume);
      document.removeEventListener('touchstart', resume);
    };
    document.addEventListener('click', resume, { once: true });
    document.addEventListener('touchstart', resume, { once: true });
  }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transitionOverlay = document.getElementById('pageTransition');

requestAnimationFrame(() => {
  document.body.classList.add('page-ready');
});

if (!prefersReducedMotion && transitionOverlay) {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    const isSamePage = !href || href.startsWith('#');
    const isExternal = link.target === '_blank' || /^https?:\/\//i.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    const isModifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
    if (isSamePage || isExternal || isModifiedClick) return;

    e.preventDefault();
    transitionOverlay.classList.add('leaving');
    setTimeout(() => { window.location.href = href; }, 280);
  });
}

const bar = document.getElementById('progressBar');
if (bar) {
  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

function tick() {
  const el = document.getElementById('liveClock');
  if (!el) return;
  const now  = new Date();
  el.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map(v => String(v).padStart(2, '0'))
    .join(':');
}
setInterval(tick, 1000);
tick();

async function sendToGus() {
  const inputEl = document.getElementById('aiInput');
  const statusEl = document.getElementById('aiStatus');
  const btnEl = document.getElementById('aiBtn');
  const userText = inputEl.value.trim();

  if (!userText || btnEl.disabled) return;

  statusEl.style.color = 'var(--text2)';
  statusEl.textContent = 'กัสกำลังพิมพ์... 💬';
  btnEl.disabled = true;

  try {
    const response = await fetch('/.netlify/functions/gus-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();
    statusEl.style.color = 'var(--acc)';
    statusEl.textContent = data.reply || 'ตอนนี้กัสตอบไม่ได้ ลองพิมพ์ใหม่อีกทีนะ 😅';
    inputEl.value = '';

  } catch (error) {
    console.error('Error:', error);
    statusEl.style.color = 'var(--text3)';
    statusEl.textContent = "ตอนระบบล่มชั่วคราว ลองทักมาใหม่นะ 😅";
  } finally {
    btnEl.disabled = false;
  }
}

document.getElementById('aiInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendToGus();
    }
});