/* ═══════════════════════════════════════════════════════════
   ASHWAGANDHA — MAIN JAVASCRIPT (HEAT-OPTIMIZED)
   GSAP + ScrollTrigger + All Interactions
   ✅ Mobile heat fixes: particles off, throttled scroll,
      lazy 3D, page-visibility pause, reduced motion respect
═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   0. DEVICE / PERFORMANCE DETECTION
──────────────────────────────────────────────── */
const PERF = (() => {
  const ua = navigator.userAgent || '';
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)
                   || window.matchMedia('(max-width: 900px)').matches
                   || (navigator.maxTouchPoints > 1 && window.innerWidth < 1100);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowMemory = (navigator.deviceMemory && navigator.deviceMemory <= 4);
  const lowCPU = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  const saveData = (navigator.connection && navigator.connection.saveData) || false;
  const lowEnd = isMobile || lowMemory || lowCPU || saveData;

  // Add classes to <html> so CSS can also adapt
  const html = document.documentElement;
  if (isMobile) html.classList.add('is-mobile');
  if (lowEnd)   html.classList.add('is-low-end');
  if (reducedMotion) html.classList.add('is-reduced-motion');

  return { isMobile, reducedMotion, lowMemory, lowCPU, saveData, lowEnd };
})();

/* ────────────────────────────────────────────────
   PAGE VISIBILITY — global pause flag
──────────────────────────────────────────────── */
let pageVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
  pageVisible = !document.hidden;
});

/* ────────────────────────────────────────────────
   1. INIT — wait for DOM
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (window.gsap) gsap.registerPlugin(ScrollTrigger);
  initScrollProgress();
  initNavDots();
  initParticles();          // skipped on mobile/low-end
  initHeroTyping();
  initHeroParallax();       // skipped on mobile
  initGSAPAnimations();
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
  initGLBModal();           // model-viewer is lazy-loaded inside
});

/* ────────────────────────────────────────────────
   2. SCROLL PROGRESS BAR (throttled with rAF)
──────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100).toFixed(2) + '%';
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

/* ────────────────────────────────────────────────
   3. NAV DOTS
──────────────────────────────────────────────── */
function initNavDots() {
  const buttons = document.querySelectorAll('#nav-dots button');
  const sections = document.querySelectorAll('.section[data-section]');
  if (!buttons.length || !sections.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.section, 10);
      const target = document.querySelector(`.section[data-section="${idx}"]`);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = entry.target.dataset.section;
        buttons.forEach(b => b.classList.toggle('active', b.dataset.section === idx));
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

/* ────────────────────────────────────────────────
   4. HERO PARTICLES (canvas)
   ✅ DISABLED on mobile / low-end / reduced-motion
   ✅ PAUSES when hero scrolled out of view
   ✅ PAUSES when tab hidden
──────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  // ❌ Don't run on mobile or low-end devices — biggest heat saver
  if (PERF.lowEnd || PERF.reducedMotion) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  let W, H, particles = [];
  let rafId = null;
  let heroVisible = true;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Reduced count: 70 → 35 (still looks great, half the work)
  const COUNT = 35;

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -(Math.random() * 0.6 + 0.2);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '#4a8c60' : '#c9a84c';
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.001;
      if (this.y < -10 || this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  const animate = () => {
    if (!pageVisible || !heroVisible) {
      rafId = null;
      return;
    }
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animate);
  };

  const start = () => { if (!rafId) rafId = requestAnimationFrame(animate); };
  const stop  = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } ctx.clearRect(0, 0, W, H); };

  // Pause when hero scrolls out of view
  const heroSection = document.getElementById('sec-1') || canvas.parentElement;
  if (heroSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      if (heroVisible && pageVisible) start();
      else stop();
    }, { threshold: 0.05 });
    io.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && heroVisible) start();
    else stop();
  });

  start();
}

/* ────────────────────────────────────────────────
   5. HERO TYPING EFFECT + GLITCH RETYPE
   ✅ Mobile: only ONE glitch cycle, then static (no infinite loop)
──────────────────────────────────────────────── */
function initHeroTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;
  const text = 'Ashwagandha';
  let i = 0;

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.appendChild(cursor);

  const type = () => {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      el.appendChild(cursor);
      i++;
      setTimeout(type, 100);
    } else {
      // On reduced motion or low-end devices → no glitch loop, just static
      if (PERF.reducedMotion) return;
      setTimeout(startGlitch, 3000);
    }
  };

  const glitchChars = '!@#$%Ω∑√∏αβγδΨ?<>[]';

  function startGlitch() {
    if (!pageVisible) {
      // Retry when page becomes visible
      setTimeout(startGlitch, 3000);
      return;
    }
    let glitchCount = 0;
    const maxGlitches = 10;
    el.classList.add('hero-title-glitch');

    const glitchInterval = setInterval(() => {
      if (glitchCount >= maxGlitches) {
        clearInterval(glitchInterval);
        el.classList.remove('hero-title-glitch');
        el.textContent = text;
        el.appendChild(cursor);
        setTimeout(retypeAlt, 350);
        return;
      }
      const glitched = text.split('').map(ch =>
        Math.random() > 0.55
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : ch
      ).join('');
      el.textContent = glitched;
      el.appendChild(cursor);
      glitchCount++;
    }, 85);
  }

  function retypeAlt() {
    el.textContent = '';
    el.classList.add('hero-title-alt');
    el.appendChild(cursor);
    let j = 0;
    const retypeInterval = setInterval(() => {
      el.textContent = text.slice(0, j);
      el.appendChild(cursor);
      j++;
      if (j > text.length) {
        clearInterval(retypeInterval);
        setTimeout(() => {
          el.classList.remove('hero-title-alt');
          el.textContent = text;
          el.appendChild(cursor);
          // ✅ On mobile/low-end: STOP loop after one cycle
          if (PERF.lowEnd) return;
          setTimeout(startGlitch, 5000);
        }, 1800);
      }
    }, 80);
  }

  setTimeout(type, 600);
}

/* ────────────────────────────────────────────────
   6. HERO PARALLAX
   ✅ DISABLED on mobile (heaviest scroll work)
──────────────────────────────────────────────── */
function initHeroParallax() {
  if (PERF.isMobile || PERF.reducedMotion) return; // skip entirely

  const heroCard = document.getElementById('hero-bg');
  const heroImg = document.getElementById('hero-img');
  if (!heroCard || !heroImg) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const progress = Math.min(window.scrollY / window.innerHeight, 1);
      heroCard.style.transform = `translateY(${progress * 24}px)`;
      heroImg.style.transform = `scale(${1 + progress * 0.04}) translateY(${progress * 10}px)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ────────────────────────────────────────────────
   7. GSAP ScrollTrigger ANIMATIONS
──────────────────────────────────────────────── */
function initGSAPAnimations() {
  if (!window.gsap) return;

  gsap.utils.toArray('.gsap-fade').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, duration: 1,
      delay: 0.5 + i * 0.18,
      ease: 'power2.out'
    });
  });

  gsap.utils.toArray('.gsap-up').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('.gsap-left').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  gsap.utils.toArray('.gsap-right').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.85, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ────────────────────────────────────────────────
   8. TIMELINE SCROLL ANIMATION
──────────────────────────────────────────────── */
function initTimeline() {
  if (!window.gsap) return;
  const line = document.getElementById('timeline-line');
  if (line) {
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '#sec-2', start: 'top 70%', end: 'bottom 30%', scrub: 1 }
    });
  }

  gsap.utils.toArray('.gsap-timeline').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });
}

/* ────────────────────────────────────────────────
   9. CHEMICAL COMPOUND TOOLTIPS
──────────────────────────────────────────────── */
function initChemTooltips() {
  const tooltip = document.getElementById('chem-tooltip');
  if (!tooltip) return;
  const chips = document.querySelectorAll('.chem-chip[data-tooltip]');

  chips.forEach(chip => {
    chip.addEventListener('mouseenter', e => {
      tooltip.textContent = chip.dataset.tooltip;
      positionTooltip(e);
      tooltip.classList.add('visible');
    });
    chip.addEventListener('mousemove', positionTooltip);
    chip.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
  });

  function positionTooltip(e) {
    const tw = tooltip.offsetWidth || 280;
    const th = tooltip.offsetHeight || 80;
    let left = e.clientX + 14;
    let top  = e.clientY - th / 2;
    if (left + tw > window.innerWidth - 10) left = e.clientX - tw - 14;
    if (top < 10) top = 10;
    if (top + th > window.innerHeight - 10) top = window.innerHeight - th - 10;
    tooltip.style.left = left + 'px';
    tooltip.style.top  = top + 'px';
  }
}

/* ────────────────────────────────────────────────
   10. MEDICINAL USE PROGRESS BARS
──────────────────────────────────────────────── */
function initMedProgressBars() {
  if (!window.ScrollTrigger) return;
  document.querySelectorAll('.med-bar').forEach(bar => {
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%', once: true,
      onEnter: () => setTimeout(() => bar.classList.add('animated'), 100)
    });
  });
}

/* ────────────────────────────────────────────────
   11. TRADITIONAL USE CARDS
──────────────────────────────────────────────── */
function initTradCards() {
  document.querySelectorAll('.trad-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/* ────────────────────────────────────────────────
   11B. MISCONCEPTION CARDS
──────────────────────────────────────────────── */
function initMisconceptionCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Tap to flip');

    const toggle = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();
      const alreadyFlipped = card.classList.contains('is-flipped');
      cards.forEach(c => c.classList.remove('is-flipped'));
      if (!alreadyFlipped) card.classList.add('is-flipped');
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', toggle);
  });
}

/* ────────────────────────────────────────────────
   12. ACCORDION
──────────────────────────────────────────────── */
function initAccordion() {
  document.querySelectorAll('.accord-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accord-item');
      const body = item.querySelector('.accord-body');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.accord-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accord-body').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ────────────────────────────────────────────────
   13. 360° PRODUCT VIEWER
──────────────────────────────────────────────── */
function initViewer360() {
  const stage = document.getElementById('viewer-stage');
  const img = document.getElementById('viewer-img');
  const slider = document.getElementById('viewer-slider');
  const resetBtn = document.getElementById('viewer-reset');
  const frameNum = document.getElementById('viewer-frame-num');
  if (!stage || !img) return;

  const TOTAL_FRAMES = 9;
  const DRAG_SENSITIVITY = 18;
  const frameSources = Array.from({ length: TOTAL_FRAMES }, (_, i) => `assets/products/capsules/360/${i + 1}.webp`);

  let currentFrame = 0;
  let dragStartX = 0;
  let dragStartFrame = 0;
  let isDragging = false;
  let activePointerId = null;

  // ✅ Lazy preload — only when stage scrolls into view (saves bandwidth + memory)
  let preloaded = false;
  const preloadFrames = () => {
    if (preloaded) return;
    preloaded = true;
    frameSources.forEach(src => { const i = new Image(); i.src = src; });
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { preloadFrames(); io.disconnect(); }
    }, { rootMargin: '200px' });
    io.observe(stage);
  } else {
    preloadFrames();
  }

  function setFrame(n) {
    currentFrame = ((n % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    img.style.display = 'block';
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'none';
    stage.classList.remove('viewer-fallback');
    img.src = frameSources[currentFrame];
    if (slider) slider.value = String(currentFrame);
    if (frameNum) frameNum.textContent = String(currentFrame + 1);
  }

  function beginDrag(clientX, pointerId = null) {
    isDragging = true;
    activePointerId = pointerId;
    dragStartX = clientX;
    dragStartFrame = currentFrame;
    stage.classList.add('is-dragging');
  }

  function updateDrag(clientX) {
    const delta = clientX - dragStartX;
    const frameDelta = Math.round(delta / DRAG_SENSITIVITY);
    setFrame(dragStartFrame + frameDelta);
  }

  function endDrag(pointerId = null) {
    if (pointerId !== null && activePointerId !== null && pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    stage.classList.remove('is-dragging');
  }

  if (slider) {
    slider.max = String(TOTAL_FRAMES - 1);
    slider.addEventListener('input', () => setFrame(parseInt(slider.value, 10) || 0));
  }

  if (window.PointerEvent) {
    stage.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      beginDrag(event.clientX, event.pointerId);
      if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
    });
    stage.addEventListener('pointermove', event => {
      if (!isDragging) return;
      if (activePointerId !== null && event.pointerId !== activePointerId) return;
      updateDrag(event.clientX);
    });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
      stage.addEventListener(type, event => endDrag(event.pointerId));
    });
  } else {
    stage.addEventListener('mousedown', event => { event.preventDefault(); beginDrag(event.clientX); });
    window.addEventListener('mousemove', event => { if (isDragging) updateDrag(event.clientX); });
    window.addEventListener('mouseup', () => endDrag());
    stage.addEventListener('touchstart', event => beginDrag(event.touches[0].clientX), { passive: true });
    stage.addEventListener('touchmove', event => { if (isDragging) updateDrag(event.touches[0].clientX); }, { passive: true });
    stage.addEventListener('touchend', () => endDrag(), { passive: true });
  }

  if (resetBtn) resetBtn.addEventListener('click', () => setFrame(0));

  img.addEventListener('error', () => {
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'flex';
    stage.classList.add('viewer-fallback');
    img.style.display = 'none';
  });

  setFrame(0);
}

/* ────────────────────────────────────────────────
   14. STAT COUNTERS
──────────────────────────────────────────────── */
function initStatCounters() {
  if (!window.ScrollTrigger) return;
  document.querySelectorAll('.c-stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let animated = false;

    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        if (animated) return;
        animated = true;
        const duration = 1800;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const update = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOut(progress);
          el.textContent = Math.round(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toLocaleString();
        };
        requestAnimationFrame(update);
      }
    });
  });
}

/* ────────────────────────────────────────────────
   15. SMOOTH SCROLL
──────────────────────────────────────────────── */
function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ────────────────────────────────────────────────
   16. IMAGE FALLBACKS
──────────────────────────────────────────────── */
function initImageFallbacks() {
  const capImg = document.getElementById('img-capsules');
  if (capImg) {
    capImg.addEventListener('error', () => {
      const wrap = capImg.closest('.dosage-img-wrap');
      if (wrap) wrap.innerHTML = '<div class="dosage-fallback"><i class="fa-solid fa-capsules"></i></div>';
    });
  }
  const powImg = document.getElementById('img-powder');
  if (powImg) {
    powImg.addEventListener('error', () => {
      const wrap = powImg.closest('.dosage-img-wrap');
      if (wrap) wrap.innerHTML = '<div class="dosage-fallback"><i class="fa-solid fa-mortar-pestle"></i></div>';
    });
  }
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      const bg = heroImg.closest('.hero-image-card');
      if (bg) bg.classList.add('hero-bg-fallback');
    });
  }
  document.querySelectorAll('.team-avatar').forEach(img => {
    img.addEventListener('error', () => { img.style.opacity = '0'; });
  });
  const instructorAvatar = document.querySelector('.instructor-avatar');
  if (instructorAvatar) {
    instructorAvatar.addEventListener('error', () => { instructorAvatar.style.opacity = '0'; });
  }
}

/* ────────────────────────────────────────────────
   17. HEADER — Scroll shadow (throttled)
──────────────────────────────────────────────── */
(function() {
  const header = document.getElementById('site-header');
  if (!header) return;
  let last = 0;
  window.addEventListener('scroll', () => {
    const big = window.scrollY > 20;
    if (big !== last) {
      header.style.boxShadow = big
        ? '0 24px 60px rgba(0,0,0,0.28)'
        : '0 22px 60px rgba(0,0,0,0.22)';
      last = big;
    }
  }, { passive: true });
})();

/* ────────────────────────────────────────────────
   18. CHEMICAL GROUP NAME INFO POPUP
──────────────────────────────────────────────── */
function initChemGroupInfo() {
  const groupInfoData = {
    'withanolides': {
      title: 'Withanolides',
      info: 'Steroidal lactones unique to the Withania genus. They are the primary bioactive compounds responsible for most of ashwagandha\'s adaptogenic, anti-cancer, and anti-inflammatory properties.'
    },
    'alkaloids': {
      title: 'Alkaloids',
      info: 'Nitrogen-containing organic compounds produced by plants. They are biologically active and exert potent effects on the nervous system — contributing to ashwagandha\'s sedative and neuro-modulating actions.'
    },
    'glycosides': {
      title: 'Glycosides',
      info: 'Compounds where a sugar molecule is bonded to a non-sugar (aglycone). In ashwagandha, withanosides and sitoindosides act on GABA receptors to produce anxiolytic and immunostimulant effects.'
    },
    'others': {
      title: 'Flavonoids & Sterols',
      info: 'Plant polyphenols and phytosterols with strong antioxidant, anti-inflammatory, and cardioprotective properties. They neutralize free radicals and support lipid metabolism.'
    }
  };

  const popup = document.createElement('div');
  popup.className = 'group-info-popup';
  popup.id = 'group-info-popup';
  document.body.appendChild(popup);

  let hideTimer = null;

  function showPopup(groupKey, refEl) {
    const data = groupInfoData[groupKey];
    if (!data) return;
    clearTimeout(hideTimer);
    popup.innerHTML = `<div class="group-info-title">${data.title}</div><p>${data.info}</p>`;
    popup.classList.add('visible');
    positionPopup(refEl);
  }
  function hidePopup() {
    hideTimer = setTimeout(() => popup.classList.remove('visible'), 200);
  }
  function positionPopup(refEl) {
    const rect = refEl.getBoundingClientRect();
    const pw = popup.offsetWidth || 280;
    let left = rect.left;
    let top = rect.bottom + 10;
    if (left + pw > window.innerWidth - 12) left = window.innerWidth - pw - 12;
    if (top + 140 > window.innerHeight - 12) top = rect.top - 145;
    popup.style.left = left + 'px';
    popup.style.top  = top + 'px';
  }

  document.querySelectorAll('.chem-group').forEach(group => {
    const key = group.dataset.group;
    const h3 = group.querySelector('h3');
    if (!h3 || !key) return;

    h3.addEventListener('click', (e) => {
      e.stopPropagation();
      if (popup.classList.contains('visible')) popup.classList.remove('visible');
      else showPopup(key, h3);
    });
    h3.addEventListener('mouseenter', () => showPopup(key, h3));
    h3.addEventListener('mouseleave', hidePopup);
  });

  document.addEventListener('click', () => popup.classList.remove('visible'));
}

/* ─────────────────────────────────────────────────
   19. 3D GLB MODEL MODAL
   ✅ model-viewer library is LAZY LOADED on first open
   ✅ Mobile: lower quality settings (less GPU heat)
   ✅ Battery API: warns if battery low
   ✅ Auto-rotate stops when not visible
───────────────────────────────────────────────── */
function initGLBModal() {
  const openBtn  = document.getElementById('glb-open-btn');
  const modal    = document.getElementById('glb-modal');
  const stage    = document.getElementById('glb-modal-stage');
  const loader   = document.getElementById('glb-loader');
  if (!openBtn || !modal || !stage) return;

  const MODEL_SRC = 'assets/3d/ashwagandha.glb';
  const MV_SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';

  let mv = null;
  let mvScriptLoaded = false;
  let mvScriptLoading = null;

  // ──────── Lazy-load <model-viewer> library ────────
  function loadMVScript() {
    if (mvScriptLoaded) return Promise.resolve();
    if (mvScriptLoading) return mvScriptLoading;
    mvScriptLoading = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = MV_SCRIPT_SRC;
      s.onload = () => { mvScriptLoaded = true; resolve(); };
      s.onerror = () => reject(new Error('Failed to load model-viewer'));
      document.head.appendChild(s);
    });
    return mvScriptLoading;
  }

  // ──────── Battery warning ────────
  async function checkBattery() {
    try {
      if (!navigator.getBattery) return true;
      const b = await navigator.getBattery();
      if (b.level < 0.20 && !b.charging) {
        return confirm('⚠️ Your battery is low (' + Math.round(b.level * 100) + '%).\n\nThe 3D model uses extra power and may heat your device.\n\nContinue anyway?');
      }
      return true;
    } catch (e) { return true; }
  }

  async function openModal() {
    const proceed = await checkBattery();
    if (!proceed) return;

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (loader) {
      loader.style.display = 'flex';
      const fillEl = document.getElementById('glb-loader-fill');
      if (fillEl) fillEl.style.width = '5%';
    }

    try {
      await loadMVScript();
      // Wait one frame so the popup animation finishes
      await new Promise(r => setTimeout(r, 200));
      buildViewer();
    } catch (err) {
      if (loader) {
        loader.innerHTML = `
          <div class="glb-loader-error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div class="glb-loader-text">Could not load 3D engine</div>
            <small class="glb-loader-sub">Check your internet connection</small>
          </div>`;
      }
    }
  }

  function buildViewer() {
    mv = document.createElement('model-viewer');
    mv.setAttribute('src', MODEL_SRC);
    mv.setAttribute('alt', '3D Ashwagandha plant');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('interaction-prompt', 'auto');
    mv.setAttribute('loading', 'eager');

    // ✅ MOBILE = LOW QUALITY settings (saves GPU + heat)
    if (PERF.lowEnd) {
      mv.setAttribute('shadow-intensity', '0');           // no shadows
      mv.setAttribute('exposure', '1');
      mv.setAttribute('environment-image', 'neutral');
      mv.setAttribute('disable-tap', '');
      mv.setAttribute('min-field-of-view', '25deg');
      mv.setAttribute('max-field-of-view', '45deg');
      // No auto-rotate on low-end devices (constant GPU work)
    } else {
      mv.setAttribute('shadow-intensity', '1.1');
      mv.setAttribute('exposure', '1.05');
      mv.setAttribute('environment-image', 'neutral');
      mv.setAttribute('auto-rotate', '');
      mv.setAttribute('auto-rotate-delay', '800');
      mv.setAttribute('rotation-per-second', '18deg');
    }

    mv.className = 'glb-viewer';

    mv.addEventListener('progress', (ev) => {
      const fillEl = document.getElementById('glb-loader-fill');
      const pct = Math.max(0.05, (ev.detail.totalProgress || 0));
      if (fillEl) fillEl.style.width = (pct * 100).toFixed(0) + '%';
    });

    mv.addEventListener('load', () => {
      if (loader) loader.style.display = 'none';
    });

    mv.addEventListener('error', () => {
      if (loader) {
        loader.innerHTML = `
          <div class="glb-loader-error">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <div class="glb-loader-text">Could not load 3D model</div>
            <small class="glb-loader-sub">Ensure <code>assets/3d/ashwagandha.glb</code> exists</small>
          </div>`;
      }
    });

    stage.appendChild(mv);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // ✅ Destroy model-viewer to FREE WebGL context (very important for heat!)
    if (mv && mv.parentNode) {
      try {
        if (typeof mv.dismissPoster === 'function') mv.dismissPoster();
        mv.removeAttribute('src');
        mv.parentNode.removeChild(mv);
      } catch (e) { /* no-op */ }
    }
    mv = null;

    if (loader) {
      loader.style.display = 'flex';
      loader.innerHTML = `
        <div class="glb-loader-spinner"></div>
        <div class="glb-loader-text">Loading 3D model…</div>
        <div class="glb-loader-bar"><div class="glb-loader-bar-fill" id="glb-loader-fill"></div></div>
        <small class="glb-loader-sub">Please wait while we prepare the interactive plant</small>`;
    }
  }

  openBtn.addEventListener('click', openModal);
  modal.querySelectorAll('[data-glb-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  // ✅ If user switches tabs, pause auto-rotate (saves battery)
  document.addEventListener('visibilitychange', () => {
    if (!mv) return;
    if (document.hidden) mv.removeAttribute('auto-rotate');
    else if (!PERF.lowEnd) mv.setAttribute('auto-rotate', '');
  });
}
