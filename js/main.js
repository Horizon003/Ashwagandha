/* ═══════════════════════════════════════════════════════════
   ASHWAGANDHA — MAIN JAVASCRIPT  (clean optimised build)
═══════════════════════════════════════════════════════════ */
'use strict';

const IS_MOBILE = window.innerWidth < 768;

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavDots();
  if (!IS_MOBILE) initParticles();
  initHeroTyping();
  if (!IS_MOBILE) initHeroParallax();
  initFadeAnimations();
  initTimeline();
  initChemTooltips();
  initChemGroupInfo();
  initMedProgressBars();
  initTradCards();
  initMisconceptionCards();
  initAccordion();
  initViewer360();
  initStatCounters();
  initSmoothScrollLinks();
  initImageFallbacks();
  initPlant360Video();
});

/* ── 1. SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ── 2. NAV DOTS ── */
function initNavDots() {
  const dots = document.querySelectorAll('#nav-dots button[data-section]');
  const sections = document.querySelectorAll('.section[data-section]');
  if (!dots.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.dataset.section;
        dots.forEach(d => d.classList.toggle('active', d.dataset.section === id));
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => obs.observe(s));
  dots.forEach(d => d.addEventListener('click', () => {
    document.querySelector(`.section[data-section="${d.dataset.section}"]`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }));
}

/* ── 3. PARTICLES (desktop only, 14 max) ── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W; this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.5 + 0.8; this.speedX = (Math.random() - 0.5) * 0.35;
      this.speedY = -(Math.random() * 0.5 + 0.15); this.alpha = Math.random() * 0.4 + 0.08;
      this.color = Math.random() > 0.5 ? '#c8a852' : '#4a8a5c';
    }
    update() { this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.0008; if (this.y < -10 || this.alpha <= 0) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.globalAlpha = Math.max(0, this.alpha); ctx.fill(); }
  }
  for (let i = 0; i < 14; i++) particles.push(new Particle());
  const animate = () => { ctx.clearRect(0, 0, W, H); ctx.globalAlpha = 1; particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); };
  animate();
}

/* ── 4. HERO TYPING + GLITCH LOOP ── */
function initHeroTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;
  const text = 'Ashwagandha';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  const type = () => {
    if (i <= text.length) { el.textContent = text.slice(0, i); el.appendChild(cursor); i++; setTimeout(type, 100); }
    else setTimeout(startGlitch, 3000);
  };
  const gChars = '!@#Ω∑√αβγΨ?<>';
  function startGlitch() {
    let c = 0; el.classList.add('hero-title-glitch');
    const iv = setInterval(() => {
      if (c++ >= 10) { clearInterval(iv); el.classList.remove('hero-title-glitch'); el.textContent = text; el.appendChild(cursor); setTimeout(retypeAlt, 350); return; }
      el.textContent = text.split('').map(ch => Math.random() > 0.55 ? gChars[Math.floor(Math.random() * gChars.length)] : ch).join('');
      el.appendChild(cursor);
    }, 85);
  }
  function retypeAlt() {
    el.textContent = ''; el.classList.add('hero-title-alt'); el.appendChild(cursor); let j = 0;
    const iv = setInterval(() => {
      el.textContent = text.slice(0, j); el.appendChild(cursor); j++;
      if (j > text.length) { clearInterval(iv); setTimeout(() => { el.classList.remove('hero-title-alt'); el.textContent = text; el.appendChild(cursor); setTimeout(startGlitch, 5000); }, 1800); }
    }, 80);
  }
  setTimeout(type, 600);
}

/* ── 5. HERO PARALLAX (desktop) ── */
function initHeroParallax() {
  const heroCard = document.getElementById('hero-bg'), heroImg = document.getElementById('hero-img');
  if (!heroCard || !heroImg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const p = Math.min(window.scrollY / window.innerHeight, 1);
      heroCard.style.transform = `translateY(${p * 20}px)`;
      heroImg.style.transform  = `scale(${1 + p * 0.03}) translateY(${p * 8}px)`;
      ticking = false;
    });
  }, { passive: true });
}

/* ── 6. SCROLL ANIMATIONS — smooth, staggered, stable ── */
function initFadeAnimations() {
  // Mobile: instant reveal, no jank
  if (IS_MOBILE) {
    document.querySelectorAll('.gsap-up,.gsap-left,.gsap-right,.gsap-fade').forEach(el => {
      el.style.cssText = 'opacity:1;transform:none;transition:none;';
    });
    return;
  }

  // Desktop: staggered IntersectionObserver — smooth fade+slide
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      // Get delay from --delay CSS var or style attr
      const styleDelay = el.style.getPropertyValue('--delay');
      const delay = styleDelay ? parseFloat(styleDelay) * 1000 : 0;
      setTimeout(() => {
        el.style.transition = 'opacity 0.55s cubic-bezier(0.2,0.8,0.3,1), transform 0.55s cubic-bezier(0.2,0.8,0.3,1)';
        el.style.opacity    = '1';
        el.style.transform  = 'none';
      }, delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Stagger siblings automatically when inside same parent
  document.querySelectorAll('.gsap-up,.gsap-left,.gsap-right,.gsap-fade').forEach((el, globalIdx) => {
    // If element has no explicit delay, auto-stagger siblings
    if (!el.style.getPropertyValue('--delay')) {
      const siblings = Array.from(el.parentElement?.querySelectorAll('.gsap-up,.gsap-left,.gsap-right,.gsap-fade') || []);
      const sibIdx = siblings.indexOf(el);
      if (sibIdx > 0) {
        el.style.setProperty('--delay', (sibIdx * 0.08).toString());
      }
    }
    obs.observe(el);
  });

  // Hero section elements — fade in immediately on page load
  const heroEls = document.querySelectorAll('#sec-0 .gsap-fade');
  heroEls.forEach((el, i) => {
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 300 + i * 150);
  });
}

/* ── 7. TIMELINE ── */
function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  if (IS_MOBILE) { items.forEach(el => el.classList.add('tl-visible')); return; }
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('tl-visible'); obs.unobserve(e.target); } }); }, { threshold: 0.2 });
  items.forEach(el => obs.observe(el));
}

/* ── 8. CHEM TOOLTIPS ── */
function initChemTooltips() {
  const tooltip = document.getElementById('chem-tooltip');
  if (!tooltip) return;
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', e => { tooltip.textContent = e.target.dataset.tooltip; tooltip.classList.add('visible'); });
    el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    el.addEventListener('mousemove', e => { tooltip.style.left = (e.clientX + 14) + 'px'; tooltip.style.top = (e.clientY - 10) + 'px'; });
  });
}

/* ── 9. CHEM GROUP INFO POPUP ── */
function initChemGroupInfo() {
  const data = {
    'withanolides': { title: 'Withanolides',      info: 'Steroidal lactones unique to Withania genus. Primary bioactive compounds — adaptogenic, anti-cancer, anti-inflammatory.' },
    'alkaloids':    { title: 'Alkaloids',          info: 'Nitrogen-based compounds. Biologically active — contribute to sedative and neuro-modulating actions.' },
    'glycosides':   { title: 'Glycosides',         info: 'Sugar bonded to non-sugar compounds. Act on GABA receptors for anxiolytic and immunostimulant effects.' },
    'others':       { title: 'Flavonoids & Sterols', info: 'Antioxidant polyphenols and phytosterols. Anti-inflammatory, cardioprotective, free-radical scavenging.' }
  };
  const popup = document.createElement('div');
  popup.className = 'group-info-popup'; document.body.appendChild(popup);
  let hideTimer = null;
  function show(key, ref) {
    const d = data[key]; if (!d) return; clearTimeout(hideTimer);
    popup.innerHTML = `<div class="group-info-title">${d.title}</div><p>${d.info}</p>`;
    popup.classList.add('visible');
    const r = ref.getBoundingClientRect();
    let left = r.left, top = r.bottom + 10;
    if (left + 280 > window.innerWidth - 12) left = window.innerWidth - 292;
    popup.style.left = left + 'px'; popup.style.top = top + 'px';
  }
  document.querySelectorAll('.chem-group').forEach(g => {
    const key = g.dataset.group, h3 = g.querySelector('h3'); if (!h3 || !key) return;
    h3.addEventListener('click', e => { e.stopPropagation(); popup.classList.contains('visible') ? popup.classList.remove('visible') : show(key, h3); });
    h3.addEventListener('mouseenter', () => show(key, h3));
    h3.addEventListener('mouseleave', () => { hideTimer = setTimeout(() => popup.classList.remove('visible'), 200); });
  });
  document.addEventListener('click', () => popup.classList.remove('visible'));
}

/* ── 10. MED PROGRESS BARS ── */
function initMedProgressBars() {
  const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.width + '%'; obs.unobserve(e.target); } }); }, { threshold: 0.3 });
  document.querySelectorAll('.med-bar-fill[data-width]').forEach(b => obs.observe(b));
}

/* ── 11. TRAD CARDS ── */
function initTradCards() {
  document.querySelectorAll('.trad-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* ── 12. MISCONCEPTION CARDS — tap to flip, one at a time ── */
function initMisconceptionCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0'); card.setAttribute('role', 'button');
    const toggle = e => {
      if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
      const was = card.classList.contains('is-flipped');
      cards.forEach(c => c.classList.remove('is-flipped'));
      if (!was) card.classList.add('is-flipped');
    };
    card.addEventListener('click', toggle); card.addEventListener('keydown', toggle);
  });
}

/* ── 13. ACCORDION ── */
function initAccordion() {
  document.querySelectorAll('.accord-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accord-item'), body = item.querySelector('.accord-body');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accord-item.open').forEach(o => { o.classList.remove('open'); o.querySelector('.accord-body').style.maxHeight = '0'; });
      if (!isOpen) { item.classList.add('open'); body.style.maxHeight = body.scrollHeight + 'px'; }
    });
  });
}

/* ── 14. 360° PRODUCT VIEWER ── */
function initViewer360() {
  const stage = document.getElementById('viewer-stage'), img = document.getElementById('viewer-img'), slider = document.getElementById('viewer-slider');
  if (!stage || !img) return;
  const TOTAL = 9, frames = Array.from({ length: TOTAL }, (_, i) => `assets/products/product-360/product-${i + 1}.webp`);
  let current = 0, dragStartX = 0, dragStartFrame = 0, isDragging = false;
  frames.forEach(src => { const p = new Image(); p.src = src; });
  function setFrame(n) { current = ((n % TOTAL) + TOTAL) % TOTAL; img.src = frames[current]; if (slider) slider.value = String(current); }
  stage.addEventListener('pointerdown', e => { isDragging = true; dragStartX = e.clientX; dragStartFrame = current; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', e => { if (!isDragging) return; setFrame(dragStartFrame - Math.round((e.clientX - dragStartX) / 18)); });
  stage.addEventListener('pointerup', () => { isDragging = false; });
  if (slider) slider.addEventListener('input', () => setFrame(parseInt(slider.value)));
  setFrame(0);
}

/* ── 15. STAT COUNTERS ── */
function initStatCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.target, 10), start = performance.now();
      const ease = t => 1 - Math.pow(1 - t, 3);
      const update = now => { const p = Math.min((now - start) / 1600, 1); el.textContent = Math.round(ease(p) * target).toLocaleString(); if (p < 1) requestAnimationFrame(update); else el.textContent = target.toLocaleString(); };
      requestAnimationFrame(update); obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.c-stat-num[data-target]').forEach(el => obs.observe(el));
}

/* ── 16. SMOOTH SCROLL ── */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } });
  });
}

/* ── 17. IMAGE FALLBACKS ── */
function initImageFallbacks() {
  document.querySelectorAll('.team-avatar').forEach(img => img.addEventListener('error', () => { img.style.opacity = '0'; }));
  ['img-capsules', 'img-powder'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('error', () => { const w = el.closest('.dosage-img-wrap'); if (w) w.innerHTML = '<div class="dosage-fallback"><i class="fa-solid fa-capsules"></i></div>'; });
  });
  const hi = document.getElementById('hero-img');
  if (hi) hi.addEventListener('error', () => hi.closest('.hero-image-card')?.classList.add('hero-bg-fallback'));
}

/* ── 18. 3D MODEL MODAL — load on open, unload on close ── */
function initPlant360Video() {
  const openBtn  = document.getElementById('p3d-open-btn');
  const openBtn2 = document.getElementById('p3d-open-btn-2');
  const modal    = document.getElementById('p3d-modal');
  const closeBtn = document.getElementById('p3d-close-btn');
  const frameWrap = document.getElementById('p3d-frame-wrap');

  if (!modal) return;

  let isLoaded = false;
  let tutStep  = 0;

  // ── MODEL TEMPLATE (created fresh each open) ──
  function buildModel() {
    const mv = document.createElement('model-viewer');
    mv.id = 'plant-model';
    mv.setAttribute('src', 'assets/3d/ashwagandha.glb');
    mv.setAttribute('alt', 'Ashwagandha 3D Plant Model');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('auto-rotate', '');
    mv.setAttribute('auto-rotate-delay', '600');
    mv.setAttribute('rotation-per-second', '28deg');
    mv.setAttribute('shadow-intensity', '1');
    mv.setAttribute('shadow-softness', '0.6');
    mv.setAttribute('exposure', '1.3');
    mv.setAttribute('environment-image', 'neutral');
    mv.setAttribute('loading', 'eager');
    mv.style.cssText = 'width:100%;height:100%;display:block;background:#fff;--poster-color:#fff;';

    // Progress
    mv.addEventListener('progress', e => {
      const p   = Math.round((e.detail.totalProgress || 0) * 100);
      const bar = document.getElementById('p3d-load-bar');
      const pct = document.getElementById('p3d-pct');
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = p + '%';
    });

    // Loaded
    mv.addEventListener('load', () => {
      isLoaded = true;
      const bar  = document.getElementById('p3d-load-bar');
      const pct  = document.getElementById('p3d-pct');
      const load = document.getElementById('p3d-loading');
      if (bar) bar.style.width = '100%';
      if (pct) pct.textContent = '100%';
      setTimeout(() => load?.classList.add('hidden'), 400);
    });

    // Error
    mv.addEventListener('error', () => {
      const pct = document.getElementById('p3d-pct');
      if (pct) { pct.style.cssText = 'font-size:.85rem;color:#ef4444;-webkit-text-fill-color:#ef4444;'; pct.textContent = '⚠ File not found — check assets/3d/ashwagandha.glb'; }
    });

    // Hide tutorial on drag
    mv.addEventListener('camera-change', () => hideTut());

    return mv;
  }

  // ── OPEN ──
  function openModal() {
    // Reset loading UI
    const load = document.getElementById('p3d-loading');
    const bar  = document.getElementById('p3d-load-bar');
    const pct  = document.getElementById('p3d-pct');
    const tut  = document.getElementById('p3d-tutorial');
    if (load) { load.classList.remove('hidden'); }
    if (bar)  bar.style.width = '0%';
    if (pct)  pct.textContent = '0%';
    if (tut)  { tut.classList.remove('hidden'); tutStep = 0; showStep(0); }
    isLoaded = false;

    // Inject fresh model-viewer
    if (frameWrap) {
      const old = document.getElementById('plant-model');
      if (old) old.remove();
      frameWrap.appendChild(buildModel());
    }

    // Reconnect controls
    bindControls();

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // ── CLOSE — destroy model to free GPU/memory ──
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Small delay so close animation plays, then destroy model
    setTimeout(() => {
      const mv = document.getElementById('plant-model');
      if (mv) mv.remove();
      isLoaded = false;
    }, 320);
  }

  [openBtn, openBtn2].forEach(b => b?.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── TUTORIAL ──
  function hideTut() { document.getElementById('p3d-tutorial')?.classList.add('hidden'); }

  function showStep(n) {
    document.querySelectorAll('.p3d-tut-step').forEach((s, i) => s.classList.toggle('active', i === n));
    document.querySelectorAll('.p3d-dot').forEach((d, i) => d.classList.toggle('active', i === n));
    const nextBtn = document.getElementById('p3d-tut-next');
    if (nextBtn) nextBtn.innerHTML = n === 2
      ? 'Got it <i class="fa-solid fa-check"></i>'
      : 'Next <i class="fa-solid fa-chevron-right"></i>';
  }

  // ── BIND CONTROLS (called after model injected) ──
  function bindControls() {
    const nextBtn  = document.getElementById('p3d-tut-next');
    const skipBtn  = document.getElementById('p3d-skip-btn');
    const autoBtn  = document.getElementById('p3d-auto-btn');
    const autoLbl  = document.getElementById('p3d-auto-label');
    const resetBtn = document.getElementById('p3d-reset-btn');
    let autoOn = true;

    nextBtn?.addEventListener('click', () => {
      tutStep++; if (tutStep >= 3) hideTut(); else showStep(tutStep);
    });
    skipBtn?.addEventListener('click', hideTut);

    const setAuto = on => {
      autoOn = on;
      const mv = document.getElementById('plant-model');
      if (!mv) return;
      on ? mv.setAttribute('auto-rotate', '') : mv.removeAttribute('auto-rotate');
      autoBtn?.classList.toggle('active', on);
      if (autoLbl) autoLbl.textContent = on ? 'Auto Rotating' : 'Auto Rotate';
    };
    autoBtn?.addEventListener('click', () => setAuto(!autoOn));
    resetBtn?.addEventListener('click', () => {
      const mv = document.getElementById('plant-model');
      mv?.resetTurntableRotation?.(); mv?.jumpCameraToGoal?.();
    });
  }
}
