/* ═══════════════════════════════════════════════════════════
   ASHWAGANDHA — MAIN JAVASCRIPT
   GSAP + ScrollTrigger + All Interactions
═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────
   1. INIT — wait for DOM
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  initScrollProgress();
  initNavDots();
  initParticles();
  initHeroTyping();
  initHeroParallax();
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
  initPlant360Video();
});

/* ────────────────────────────────────────────────
   2. SCROLL PROGRESS BAR
──────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrollTop / docHeight * 100).toFixed(2) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
}

/* ────────────────────────────────────────────────
   3. NAV DOTS
──────────────────────────────────────────────── */
function initNavDots() {
  const buttons = document.querySelectorAll('#nav-dots button');
  const sections = document.querySelectorAll('.section[data-section]');

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
──────────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

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

  for (let i = 0; i < 70; i++) particles.push(new Particle());

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  };
  animate();
}

/* ────────────────────────────────────────────────
   5. HERO TYPING EFFECT + GLITCH RETYPE
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
      // First glitch starts 3s after full type
      setTimeout(startGlitch, 3000);
    }
  };

  const glitchChars = '!@#$%Ω∑√∏αβγδΨ?<>[]';

  function startGlitch() {
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
        // Show gold for 1.8s, reset normal, then wait 5s and loop again
        setTimeout(() => {
          el.classList.remove('hero-title-alt');
          el.textContent = text;
          el.appendChild(cursor);
          // ── LOOP: next cycle after 5s pause ──
          setTimeout(startGlitch, 5000);
        }, 1800);
      }
    }, 80);
  }

  // Start typing after slight delay
  setTimeout(type, 600);
}

/* ────────────────────────────────────────────────
   6. HERO PARALLAX (scroll-based zoom + move)
──────────────────────────────────────────────── */
function initHeroParallax() {
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
  // Hero fade elements
  gsap.utils.toArray('.gsap-fade').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, duration: 1,
      delay: 0.5 + i * 0.18,
      ease: 'power2.out'
    });
  });

  // Slide up
  gsap.utils.toArray('.gsap-up').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Slide from left
  gsap.utils.toArray('.gsap-left').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Slide from right
  gsap.utils.toArray('.gsap-right').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });
}

/* ────────────────────────────────────────────────
   8. TIMELINE SCROLL ANIMATION
──────────────────────────────────────────────── */
function initTimeline() {
  const line = document.getElementById('timeline-line');
  if (line) {
    gsap.fromTo(line, { scaleY: 0 }, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#sec-2',
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: 1
      }
    });
  }

  gsap.utils.toArray('.gsap-timeline').forEach(el => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--delay')) || 0;
    gsap.to(el, {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true
      }
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
    chip.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
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
   10. MEDICINAL USE PROGRESS BARS (animate on scroll)
──────────────────────────────────────────────── */
function initMedProgressBars() {
  const bars = document.querySelectorAll('.med-bar');
  bars.forEach(bar => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        setTimeout(() => bar.classList.add('animated'), 100);
      }
    });
  });
}

/* ────────────────────────────────────────────────
   11. TRADITIONAL USE CARDS (click to flip)
──────────────────────────────────────────────── */
function initTradCards() {
  document.querySelectorAll('.trad-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
    // Keyboard accessible
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
   11B. MISCONCEPTION CARDS — ONE card at a time
   Tap = flip open. Tap same card = flip back. Tap another = close old, open new.
──────────────────────────────────────────────── */
function initMisconceptionCards() {
  const cards = document.querySelectorAll('.flip-card');
  let activeCard = null;

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Tap to flip');

    const toggle = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
      if (event.type === 'keydown') event.preventDefault();

      const alreadyFlipped = card.classList.contains('is-flipped');

      // Close any open card first
      cards.forEach(c => c.classList.remove('is-flipped'));

      if (!alreadyFlipped) {
        // Open tapped card
        card.classList.add('is-flipped');
        activeCard = card;
      } else {
        // Was open — now closed (already removed above)
        activeCard = null;
      }
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

      // Close all
      document.querySelectorAll('.accord-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.accord-body').style.maxHeight = '0';
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

/* ────────────────────────────────────────────────
   13. 360° PRODUCT VIEWER
   — Drag (mouse + touch) + Slider control
   — Auto-rotate toggle
   — NO scroll interaction (as required)
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
  const frameSources = Array.from({ length: TOTAL_FRAMES }, (_, i) => `assets/products/product-360/product-${i + 1}.webp`);

  let currentFrame = 0;
  let dragStartX = 0;
  let dragStartFrame = 0;
  let isDragging = false;
  let activePointerId = null;

  frameSources.forEach(src => {
    const preload = new Image();
    preload.src = src;
  });

  function setFrame(n) {
    currentFrame = ((n % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    const nextSrc = frameSources[currentFrame];
    img.style.display = 'block';
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'none';
    stage.classList.remove('viewer-fallback');
    img.src = nextSrc;
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
    stage.addEventListener('mousedown', event => {
      event.preventDefault();
      beginDrag(event.clientX);
    });

    window.addEventListener('mousemove', event => {
      if (!isDragging) return;
      updateDrag(event.clientX);
    });

    window.addEventListener('mouseup', () => endDrag());

    stage.addEventListener('touchstart', event => {
      beginDrag(event.touches[0].clientX);
    }, { passive: true });

    stage.addEventListener('touchmove', event => {
      if (!isDragging) return;
      updateDrag(event.touches[0].clientX);
    }, { passive: true });

    stage.addEventListener('touchend', () => endDrag(), { passive: true });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => setFrame(0));
  }

  img.addEventListener('error', () => {
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'flex';
    stage.classList.add('viewer-fallback');
    img.style.display = 'none';
  });

  setFrame(0);
}

/* ────────────────────────────────────────────────
   14. STAT COUNTERS (conclusion section)
──────────────────────────────────────────────── */
function initStatCounters() {
  document.querySelectorAll('.c-stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let animated = false;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
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
   15. SMOOTH SCROLL for any in-page anchor
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
   16. IMAGE FALLBACKS (avoid inline onerror issues)
──────────────────────────────────────────────── */
function initImageFallbacks() {
  // Dosage product images
  const capImg = document.getElementById('img-capsules');
  if (capImg) {
    capImg.addEventListener('error', () => {
      const wrap = capImg.closest('.dosage-img-wrap');
      if (wrap) {
        wrap.innerHTML = '<div class="dosage-fallback"><i class="fa-solid fa-capsules"></i></div>';
      }
    });
  }

  const powImg = document.getElementById('img-powder');
  if (powImg) {
    powImg.addEventListener('error', () => {
      const wrap = powImg.closest('.dosage-img-wrap');
      if (wrap) {
        wrap.innerHTML = '<div class="dosage-fallback"><i class="fa-solid fa-mortar-pestle"></i></div>';
      }
    });
  }

  // Hero image
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    heroImg.addEventListener('error', () => {
      const bg = heroImg.closest('.hero-image-card');
      if (bg) bg.classList.add('hero-bg-fallback');
    });
  }

  // Team avatars
  document.querySelectorAll('.team-avatar').forEach(img => {
    img.addEventListener('error', () => {
      img.style.opacity = '0';
    });
  });

  // Instructor avatar
  const instructorAvatar = document.querySelector('.instructor-avatar');
  if (instructorAvatar) {
    instructorAvatar.addEventListener('error', () => {
      instructorAvatar.style.opacity = '0';
    });
  }
}

/* ────────────────────────────────────────────────
   17. HEADER — Scroll shadow enhancement
──────────────────────────────────────────────── */
(function() {
  const header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 24px 60px rgba(0,0,0,0.28)';
    } else {
      header.style.boxShadow = '0 22px 60px rgba(0,0,0,0.22)';
    }
  }, { passive: true });
})();

/* ────────────────────────────────────────────────
   9B. CHEMICAL GROUP NAME INFO POPUP (tap/hover)
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

  // Create popup element
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

    // Tap / click
    h3.addEventListener('click', (e) => {
      e.stopPropagation();
      if (popup.classList.contains('visible')) {
        popup.classList.remove('visible');
      } else {
        showPopup(key, h3);
      }
    });

    // Hover (desktop)
    h3.addEventListener('mouseenter', () => showPopup(key, h3));
    h3.addEventListener('mouseleave', hidePopup);
  });

  // Close on outside click
  document.addEventListener('click', () => popup.classList.remove('visible'));
}

/* ─────────────────────────────────────────────────
   360° 3D MODAL — open/close, tutorial, controls
───────────────────────────────────────────────── */
function initPlant360Video() {
  const openBtn   = document.getElementById('p3d-open-btn');
  const modal     = document.getElementById('p3d-modal');
  const closeBtn  = document.getElementById('p3d-close-btn');
  const modelEl   = document.getElementById('plant-model');
  const loadDiv   = document.getElementById('p3d-loading');
  const loadBar   = document.getElementById('p3d-load-bar');
  const loadPct   = document.getElementById('p3d-pct');
  const tutorial  = document.getElementById('p3d-tutorial');
  const skipBtn   = document.getElementById('p3d-skip-btn');
  const nextBtn   = document.getElementById('p3d-tut-next');
  const autoBtn   = document.getElementById('p3d-auto-btn');
  const autoLbl   = document.getElementById('p3d-auto-label');
  const resetBtn  = document.getElementById('p3d-reset-btn');

  if (!modal || !modelEl) return;

  let autoOn       = true;
  let modelLoaded  = false;
  let tutStep      = 0;
  const TUT_STEPS  = 3;

  // ── OPEN MODAL ──
  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Start loading GLB now (lazy → load triggered on open)
    if (!modelLoaded) modelEl.dismissPoster && modelEl.dismissPoster();
  }

  // ── CLOSE MODAL ──
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ── LOADING PROGRESS ──
  modelEl.addEventListener('progress', (e) => {
    const pct = Math.round((e.detail.totalProgress || 0) * 100);
    if (loadBar) loadBar.style.width = pct + '%';
    if (loadPct) loadPct.textContent = pct + '%';
  });

  modelEl.addEventListener('load', () => {
    modelLoaded = true;
    if (loadBar) loadBar.style.width = '100%';
    if (loadPct) loadPct.textContent = '100%';
    setTimeout(() => {
      if (loadDiv) loadDiv.classList.add('hidden');
    }, 400);
  });

  modelEl.addEventListener('error', () => {
    if (loadPct) {
      loadPct.style.cssText = 'font-size:0.85rem;color:#ef4444;-webkit-text-fill-color:#ef4444;';
      loadPct.textContent = '⚠ Not found';
    }
  });

  // ── TUTORIAL ──
  function showStep(n) {
    document.querySelectorAll('.p3d-tut-step').forEach((s, i) => {
      s.classList.toggle('active', i === n);
    });
    document.querySelectorAll('.p3d-dot').forEach((d, i) => {
      d.classList.toggle('active', i === n);
    });
    // Last step → change Next button to "Got it"
    if (nextBtn) nextBtn.innerHTML = n === TUT_STEPS - 1
      ? 'Got it <i class="fa-solid fa-check"></i>'
      : 'Next <i class="fa-solid fa-chevron-right"></i>';
  }

  function hideTutorial() {
    if (tutorial) tutorial.classList.add('hidden');
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      tutStep++;
      if (tutStep >= TUT_STEPS) { hideTutorial(); return; }
      showStep(tutStep);
    });
  }

  if (skipBtn) skipBtn.addEventListener('click', hideTutorial);

  // Also hide tutorial on model interaction
  modelEl.addEventListener('camera-change', () => {
    if (!tutorial.classList.contains('hidden')) hideTutorial();
  });

  showStep(0);

  // ── AUTO-ROTATE ──
  function setAuto(on) {
    autoOn = on;
    if (on) {
      modelEl.setAttribute('auto-rotate', '');
      if (autoBtn) autoBtn.classList.add('active');
      if (autoLbl) autoLbl.textContent = 'Auto Rotating';
    } else {
      modelEl.removeAttribute('auto-rotate');
      if (autoBtn) autoBtn.classList.remove('active');
      if (autoLbl) autoLbl.textContent = 'Auto Rotate';
    }
  }

  if (autoBtn) autoBtn.addEventListener('click', () => setAuto(!autoOn));

  // ── RESET ──
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      modelEl.resetTurntableRotation();
      modelEl.jumpCameraToGoal();
    });
  }
}
