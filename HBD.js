 
const overlay = document.getElementById('start-overlay');
const candleWrap = document.getElementById('candleWrap');
const musicPlayer = document.getElementById('bg-music');

function spawnSmoke() {
  for (let i = 0; i < 6; i++) {
    const wisp = document.createElement('span');
    wisp.className = 'smoke-wisp';
    wisp.style.setProperty('--sx', (Math.random() * 30 - 15) + 'px');
    wisp.style.animationDelay = (i * 0.07) + 's';
    candleWrap.appendChild(wisp);
    setTimeout(() => wisp.remove(), 1600);
  }
}

if (overlay && candleWrap) {
  overlay.addEventListener('click', function () {
    candleWrap.classList.add('blown');
    spawnSmoke();

    if (musicPlayer) {
      musicPlayer.src = 'https://www.youtube.com/embed/Itvw76ej4Mk?start=23&autoplay=1&playsinline=1';
    }

    setTimeout(() => {
      overlay.classList.add('dismissed');
      burstConfetti();
      setTimeout(() => { overlay.style.display = 'none'; }, 900);
    }, 550);
  });
}
 
const track = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');
let currentSlide = 0;

if (track && dotsWrap) {
  const totalSlides = track.children.length;
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsWrap.appendChild(dot);
  }
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }, 3000);
}
 
const canvas = document.getElementById('bg');
const card = document.querySelector('.card');

function resize() {
  if (!canvas || !card) return;
  canvas.width = card.offsetWidth || 340;
  canvas.height = card.scrollHeight || 700;
}
setTimeout(resize, 800);

const ctx = canvas ? canvas.getContext('2d') : null;
const particles = [];
let burst = [];

const PALETTE = ['#38bdf8', '#7dd3fc', '#fda4af', '#fb7185', '#f3c477'];

if (ctx) {
  for (let i = 0; i < 26; i++) {
    const kind = Math.random();
    particles.push({
      type: kind > 0.66 ? 'heart' : kind > 0.33 ? 'petal' : 'spark',
      x: Math.random() * 340,
      y: Math.random() * 800,
      size: Math.random() * 6 + 3,
      alpha: Math.random() * .2 + .05,
      angle: Math.random() * Math.PI * 2,
      vx: (Math.random() - .5) * .3,
      vy: Math.random() * .4 + .15,
      va: (Math.random() - .5) * .012,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)]
    });
  }

  function drawHeart(x, y, s, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x, y + s * .3);
    ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * .3);
    ctx.bezierCurveTo(x - s, y + s * .65, x, y + s * .9, x, y + s * 1.1);
    ctx.bezierCurveTo(x, y + s * .9, x + s, y + s * .65, x + s, y + s * .3);
    ctx.bezierCurveTo(x + s, y, x, y, x, y + s * .3);
    ctx.fill(); ctx.restore();
  }

  function drawPetal(x, y, r, ang, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.translate(x, y); ctx.rotate(ang);
    ctx.beginPath(); ctx.ellipse(0, 0, r * .4, r, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  function drawSpark(x, y, s, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const ang = (Math.PI / 2) * i;
      ctx.lineTo(x + Math.cos(ang) * s, y + Math.sin(ang) * s);
      ctx.lineTo(x + Math.cos(ang + Math.PI / 4) * s * .35, y + Math.sin(ang + Math.PI / 4) * s * .35);
    }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function drawShape(p) {
    if (p.type === 'heart') drawHeart(p.x, p.y, p.size, p.color, p.alpha);
    else if (p.type === 'petal') drawPetal(p.x, p.y, p.size, p.angle, p.color, p.alpha);
    else drawSpark(p.x, p.y, p.size, p.color, p.alpha);
  }

  window.burstConfetti = function () {
    const W = canvas.width, H = canvas.height || 800;
    const cx = W / 2, cy = H * 0.32;
    for (let i = 0; i < 26; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.6 + 1.2;
      burst.push({
        type: Math.random() > 0.5 ? 'heart' : 'spark',
        x: cx, y: cy,
        size: Math.random() * 5 + 3,
        alpha: 1,
        angle: Math.random() * Math.PI * 2,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed - 1,
        va: (Math.random() - .5) * .1,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        life: 0
      });
    }
  };

  function frame() {
    const W = canvas.width, H = canvas.height || 800;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f1a2e';
    ctx.fillRect(0, 0, W, H);

    [[0, 0], [W, 0], [0, H], [W, H], [W / 2, H * .35]].forEach(([gx, gy]) => {
      const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 150);
      gr.addColorStop(0, 'rgba(56, 189, 248, 0.13)');
      gr.addColorStop(1, 'rgba(15, 26, 46, 0)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);
    });

    for (const p of particles) {
      drawShape(p);
      p.x += p.vx; p.y += p.vy; p.angle += p.va;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
    }

    burst = burst.filter(p => p.alpha > 0.02);
    for (const p of burst) {
      drawShape(p);
      p.x += p.vx; p.y += p.vy; p.angle += p.va;
      p.vy += 0.055;
      p.life += 1;
      p.alpha = Math.max(0, 1 - p.life / 55);
    }

    requestAnimationFrame(frame);
  }

  frame();
  setInterval(() => { canvas.height = card.scrollHeight || canvas.height; }, 1500);
}
