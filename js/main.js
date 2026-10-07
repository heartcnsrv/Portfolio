// ─── LOADING ─────────────────────────────────────────────────
(function () {
  const msgs = [
    'Booting system...', 'Loading modules...', 'Connecting to server...',
    'Rendering world...', 'Spawning player...', 'Ready!'
  ];
  let pct = 0;
  const bar   = document.getElementById('loadBar');
  const glow  = document.getElementById('loadBarGlow');
  const msg   = document.getElementById('loadMsg');
  const screen= document.getElementById('loading-screen');

  const iv = setInterval(() => {
    pct += Math.random() * 20 + 4;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    bar.style.width = pct + '%';
    glow.style.left = (pct - 5) + '%';
    msg.textContent = msgs[Math.floor(pct / 100 * (msgs.length - 1))];
    if (pct === 100) setTimeout(() => screen.classList.add('hide'), 450);
  }, 190);
})();

// ─── CURSOR ───────────────────────────────────────────────────
const ring = document.getElementById('curRing');
const dot  = document.getElementById('curDot');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .pf-btn, .itag, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1.7)';
    ring.style.borderColor = '#ff4db8';
    ring.style.background = 'rgba(233,30,140,0.12)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = '#e91e8c';
    ring.style.background = 'transparent';
  });
});

// ─── BG CANVAS (pixel particles) ──────────────────────────────
(function () {
  const c   = document.getElementById('bgCanvas');
  const ctx = c.getContext('2d');
  let pts   = [];

  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize();
  addEventListener('resize', resize);

  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * c.width;
      this.y  = Math.random() * c.height;
      this.sz = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.4 - 0.1;
      this.op = Math.random() * 0.35 + 0.05;
      this.col= Math.random() > 0.65 ? '#e91e8c' : '#ffffff';
    }
    tick() {
      this.x += this.vx; this.y += this.vy; this.op -= 0.0008;
      if (this.op <= 0 || this.y < -5) this.reset();
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.op; ctx.fillStyle = this.col;
      ctx.fillRect(this.x, this.y, this.sz, this.sz);
      ctx.restore();
    }
  }

  for (let i = 0; i < 140; i++) pts.push(new Pt());

  (function loop() {
    ctx.clearRect(0, 0, c.width, c.height);
    pts.forEach(p => { p.tick(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

// ─── NAVBAR ───────────────────────────────────────────────────
const navbar  = document.getElementById('navbar');
const ham     = document.getElementById('navHamburger');
const navList = document.getElementById('navList');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 40);
  updateActiveNav();
});

ham.addEventListener('click', () => navList.classList.toggle('open'));
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));

function updateActiveNav() {
  const scrollY = window.scrollY + 80;
  document.querySelectorAll('section[id]').forEach(sec => {
    const id   = sec.id;
    const top  = sec.offsetTop;
    const bot  = top + sec.offsetHeight;
    const link = document.querySelector(`.nl-item[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}

// ─── TYPEWRITER ───────────────────────────────────────────────
(function () {
  const el = document.getElementById('typeEl');
  if (!el) return;
  const words = ['CS Student','Web Developer','Java Engineer','Python Coder','AI Enthusiast','Mobile Dev','Problem Solver'];
  let wi = 0, ci = 0, del = false;
  function tick() {
    const w = words[wi];
    if (!del) {
      el.textContent = w.slice(0, ++ci);
      if (ci === w.length) { del = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = w.slice(0, --ci);
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(tick, del ? 55 : 95);
  }
  setTimeout(tick, 1400);
})();

// ─── XP BAR ───────────────────────────────────────────────────
function triggerXP() {
  const f = document.getElementById('xpFill');
  if (f) setTimeout(() => { f.style.width = '72%'; }, 500);
}
triggerXP();
const xpObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) triggerXP(); });
}, { threshold: 0.4 });
const heroSec = document.getElementById('home');
if (heroSec) xpObs.observe(heroSec);

// ─── SKILL BARS ───────────────────────────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sbar-fill').forEach(b => {
      b.style.width = b.getAttribute('data-p') + '%';
    });
  });
}, { threshold: 0.15 });
document.querySelectorAll('.skill-cat').forEach(el => skillObs.observe(el));

// ─── REVEAL ───────────────────────────────────────────────────
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('[data-reveal]').forEach(el => revObs.observe(el));

// ─── PROJECT FILTER ───────────────────────────────────────────
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const f = this.getAttribute('data-f');
    document.querySelectorAll('.pcard').forEach(card => {
      if (f === 'all') {
        card.classList.remove('hidden');
      } else {
        card.classList.toggle('hidden', card.getAttribute('data-tier') !== f);
      }
    });
  });
});

// ─── RESUME MODAL ─────────────────────────────────────────────
const modal       = document.getElementById('resumeModal');
const modalClose  = document.getElementById('modalClose');
const navResume   = document.getElementById('navResumeBtn');
const heroResume     = document.getElementById('heroResumeBtn');
const contactResume  = document.getElementById('contactResumeBtn');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

if (navResume)  navResume.addEventListener('click', openModal);
if (heroResume) heroResume.addEventListener('click', openModal);
if (contactResume) contactResume.addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── CONTACT FORM ─────────────────────────────────────────────
const sendBtn  = document.getElementById('termSend');
const termResp = document.getElementById('termResp');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name  = document.getElementById('fName').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const msg   = document.getElementById('fMsg').value.trim();

    if (!name || !email || !msg) {
      termResp.textContent = '> ERROR: all fields required.';
      termResp.style.color = '#e74c3c';
      return;
    }
    termResp.textContent = '> Sending...';
    termResp.style.color = '#e91e8c';
    setTimeout(() => {
      termResp.textContent = `> Message sent! Thanks, ${name}. I'll reply soon.`;
      termResp.style.color = '#27ae60';
      document.getElementById('fName').value = '';
      document.getElementById('fEmail').value = '';
      document.getElementById('fMsg').value = '';
    }, 900);
  });
}

// ─── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ─── CLICK PARTICLE BURST ─────────────────────────────────────
document.addEventListener('click', e => {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    const s = Math.random() * 7 + 3;
    Object.assign(p.style, {
      position: 'fixed', left: e.clientX+'px', top: e.clientY+'px',
      width: s+'px', height: s+'px',
      background: Math.random() > 0.5 ? '#e91e8c' : '#ff4db8',
      pointerEvents: 'none', zIndex: '99997',
      transform: 'translate(-50%,-50%)',
    });
    document.body.appendChild(p);
    const vx = (Math.random()-0.5)*140, vy = (Math.random()-0.5)*140 - 50;
    let px=0, py=0, op=1;
    (function anim() {
      px += vx*0.016; py += vy*0.016 + 1.2; op -= 0.04;
      p.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
      p.style.opacity = op;
      if (op > 0) requestAnimationFrame(anim); else p.remove();
    })();
  }
});

console.log('%c[HC] :: Portfolio loaded. Press ENTER to start.', 'color:#e91e8c;font-family:monospace;font-size:13px;');
