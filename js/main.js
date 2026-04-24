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
  initMedProgressBars();
  initTradCards();
  initAccordion();
  initViewer360();
  initStatCounters();
  initSmoothScrollLinks();
  initImageFallbacks();
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
   5. HERO TYPING EFFECT
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
    }
  };

  // Start after slight delay
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
  const stage    = document.getElementById('viewer-stage');
  const img      = document.getElementById('viewer-img');
  const slider   = document.getElementById('viewer-slider');
  const resetBtn = document.getElementById('viewer-reset');
  const frameNum = document.getElementById('viewer-frame-num');
  if (!stage || !img) return;

  const TOTAL_FRAMES = 9;
  const DRAG_SENSITIVITY = 26;
  let currentFrame = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartFrame = 0;

  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const preload = new Image();
    preload.src = `assets/products/product-360/product-${i}.webp`;
  }

  function setFrame(n) {
    currentFrame = ((n % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES;
    const src = `assets/products/product-360/product-${currentFrame + 1}.webp`;
    if (!img.src.endsWith(src)) img.src = src;
    if (slider) slider.value = currentFrame;
    if (frameNum) frameNum.textContent = currentFrame + 1;
  }

  function handleDrag(clientX) {
    const delta = clientX - dragStartX;
    const frameDelta = Math.round(delta / DRAG_SENSITIVITY);
    setFrame(dragStartFrame + frameDelta);
  }

  if (slider) {
    slider.max = TOTAL_FRAMES - 1;
    slider.addEventListener('input', () => setFrame(parseInt(slider.value, 10)));
  }

  stage.addEventListener('mousedown', e => {
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX;
    dragStartFrame = currentFrame;
    stage.classList.add('is-dragging');
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    handleDrag(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    stage.classList.remove('is-dragging');
  });

  stage.addEventListener('touchstart', e => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartFrame = currentFrame;
    stage.classList.add('is-dragging');
  }, { passive: true });

  stage.addEventListener('touchmove', e => {
    if (!isDragging) return;
    handleDrag(e.touches[0].clientX);
  }, { passive: true });

  stage.addEventListener('touchend', () => {
    isDragging = false;
    stage.classList.remove('is-dragging');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => setFrame(0));
  }

  img.addEventListener('error', () => {
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'flex';
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
