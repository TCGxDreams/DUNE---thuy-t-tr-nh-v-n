// ===== DUNE PRESENTATION — PREMIUM JAVASCRIPT =====

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 2000);
});

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('themeToggleBtn');
const mobileThemeBtn = document.getElementById('mobileThemeToggleBtn');
const icon = themeBtn ? themeBtn.querySelector('i') : null;
const mobileIcon = mobileThemeBtn ? mobileThemeBtn.querySelector('i') : null;

function applyTheme(isLight) {
  if (isLight) {
    document.body.classList.add('light-theme');
    if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    if (mobileIcon) { mobileIcon.classList.remove('fa-sun'); mobileIcon.classList.add('fa-moon'); }
  } else {
    document.body.classList.remove('light-theme');
    if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    if (mobileIcon) { mobileIcon.classList.remove('fa-moon'); mobileIcon.classList.add('fa-sun'); }
  }
}

const savedTheme = localStorage.getItem('dune-theme');
if (savedTheme === 'light') applyTheme(true);

function toggleTheme() {
  const isLight = !document.body.classList.contains('light-theme');
  applyTheme(isLight);
  localStorage.setItem('dune-theme', isLight ? 'light' : 'dark');
}

if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

function getParticleRGB() {
  return document.body.classList.contains('light-theme') ? '139, 105, 20' : '194, 149, 106';
}

// ===== CUSTOM CURSOR =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX - 3 + 'px';
  cursorDot.style.top = mouseY - 3 + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX - 18 + 'px';
  cursorRing.style.top = ringY - 18 + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .theme-card, .character-card, .relevance-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== CANVAS PARTICLE SYSTEM =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasMouseX = 0, canvasMouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 + 0.1;
    this.speedY = (Math.random() - 0.5) * 0.15;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 400 + 200;
  }
  update() {
    const dx = canvasMouseX - this.x;
    const dy = canvasMouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      this.x -= dx * 0.008;
      this.y -= dy * 0.008;
    }
    this.x += this.speedX;
    this.y += this.speedY + Math.sin(this.life * 0.01) * 0.1;
    this.life++;
    if (this.x > canvas.width + 10 || this.life > this.maxLife) this.reset();
    if (this.x < -10) this.x = canvas.width + 10;
  }
  draw() {
    const fadeFactor = this.life < 30 ? this.life / 30 :
                       this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${getParticleRGB()}, ${this.opacity * fadeFactor})`;
    ctx.fill();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  canvasMouseX = e.clientX - rect.left;
  canvasMouseY = e.clientY - rect.top;
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw subtle connecting lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${getParticleRGB()}, ${0.05 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== SCROLL PROGRESS BAR =====
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = (winScroll / height * 100) + '%';
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[data-section="${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });
sections.forEach(s => navObserver.observe(s));

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ===== REVEAL ON SCROLL =====
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== HERO PARALLAX =====
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  const scrolled = window.scrollY;
  if (scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.7));
  }
});

// ===== TIMELINE ANIMATION =====
const timeline = document.getElementById('timeline');
const timelineFill = document.getElementById('timelineFill');
const timelineItems = timeline ? timeline.querySelectorAll('.timeline-item') : [];

function updateTimeline() {
  if (!timeline) return;
  const rect = timeline.getBoundingClientRect();
  const timelineTop = rect.top;
  const timelineHeight = rect.height;
  const viewportMid = window.innerHeight * 0.6;
  const progress = Math.max(0, Math.min(1, (viewportMid - timelineTop) / timelineHeight));
  timelineFill.style.height = (progress * 100) + '%';
  
  timelineItems.forEach(item => {
    const itemRect = item.getBoundingClientRect();
    if (itemRect.top < viewportMid) {
      item.classList.add('lit');
    }
  });
}
window.addEventListener('scroll', updateTimeline);

// ===== CHARACTER CARD MOUSE GLOW =====
document.querySelectorAll('.character-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
    card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
  });
});
