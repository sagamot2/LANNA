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

// ===== YouTube background music =====
// เปลี่ยน VIDEO_ID ตรงนี้เป็น id ของคลิปเพลงที่อยากใช้
// (เอามาจากลิงก์ youtube.com/watch?v=XXXXXXXXXXX ตัว XXXXXXXXXXX คือ id)
const YT_VIDEO_ID = 'VIDEO_ID_HERE';

const musicIcon = document.getElementById('musicIcon');
const musicBtn = document.getElementById('musicBtn');

let ytPlayer = null;
let ytReady = false;
let wantsPlay = false; // ผู้ใช้กดเปิดเพลงไว้ก่อน player จะพร้อมหรือเปล่า

function setMusicUI(playing) {
  if (musicIcon) musicIcon.textContent = playing ? '♪' : '♫';
  if (musicBtn) {
    musicBtn.classList.toggle('is-playing', playing);
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
  }
}

// เรียกอัตโนมัติโดย YouTube IFrame API เมื่อโหลดสคริปต์เสร็จ
function onYouTubeIframeAPIReady() {
  if (!document.getElementById('ytPlayer')) return;
  ytPlayer = new YT.Player('ytPlayer', {
    videoId: YT_VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: YT_VIDEO_ID, // จำเป็นสำหรับให้ loop ทำงานกับวิดีโอเดี่ยว
      playsinline: 1
    },
    events: {
      onReady: () => {
        ytReady = true;
        ytPlayer.setVolume(35);
        // ถ้าผู้ใช้เคยเปิดเพลงไว้ในหน้าก่อน ให้รอ interaction แล้วเล่นต่อ
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
    // player ยังโหลดไม่เสร็จ เก็บ intent ไว้ก่อน
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
