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

const YT_VIDEO_ID = 'MaeX5dV0njY';
const YT_START_SECONDS = 65;

const musicIcon = document.getElementById('musicIcon');
const musicBtn = document.getElementById('musicBtn');

let ytPlayer = null;
let ytReady = false;
let wantsPlay = false; 

function setMusicUI(playing) {
  if (musicIcon) musicIcon.textContent = playing ? '♪' : '♫';
  if (musicBtn) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }
}

function onYouTubeIframeAPIReady() {
  if (!document.getElementById('ytPlayer')) return;
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YT_VIDEO_ID, 
      playsinline: 1,
      start: YT_START_SECONDS
    },
    events: {
      onReady: () => {
        ytReady = true;
        ytPlayer.setVolume(35);
        if (localStorage.getItem('gus-music') === 'on') {
          const resume = () => {
            ytPlayer.playVideo();
            document.removeEventListener('click', resume);
            document.removeEventListener('touchstart', resume);
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        }
        if (wantsPlay) ytPlayer.playVideo();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) setMusicUI(true);
        if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) setMusicUI(false);
      }
    }
  });
}

function toggleMusic() {
  if (!ytReady || !ytPlayer) {
    wantsPlay = true;
    localStorage.setItem('gus-music', 'on');
    return;
  }
  const state = ytPlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    ytPlayer.pauseVideo();
    localStorage.setItem('gus-music', 'off');
  } else {
    ytPlayer.playVideo();
    localStorage.setItem('gus-music', 'on');
  }
}

const transitionOverlay = document.getElementById('pageTransition');

requestAnimationFrame(() => {
  document.body.classList.add('page-ready');
});

if (transitionOverlay) {
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

const mascotStage = document.getElementById('mascotStage');
if (mascotStage) {
  const chars = Array.from(mascotStage.querySelectorAll('.mascot-char'));
  const order = ['bear', 'rabbit', 'cat', 'poodle'];
  const pairs = [[order[0], order[1]], [order[2], order[3]]];
  let pairIndex = 0;

  function showPair(i) {
    const [a, b] = pairs[i];
    chars.forEach((el) => {
      el.classList.remove('slot-a', 'slot-b');
      const type = el.getAttribute('data-char');
      if (type === a) el.classList.add('slot-a');
      if (type === b) el.classList.add('slot-b');
    });
  }

  showPair(pairIndex);
  setInterval(() => {
    pairIndex = (pairIndex + 1) % pairs.length;
    showPair(pairIndex);
  }, 24000);

  mascotStage.addEventListener('click', (e) => {
    const charEl = e.target.closest('.mascot-char');
    if (!charEl || !charEl.classList.contains('slot-a') && !charEl.classList.contains('slot-b')) return;
    const rect = charEl.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height * 0.3;
    const hearts = ['💙', '✦', '♡'];
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('span');
      el.className = 'heart-pop';
      el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      el.style.left = originX + 'px';
      el.style.top = originY + 'px';
      el.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
      el.style.animationDelay = (i * 0.08) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1300);
    }
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
