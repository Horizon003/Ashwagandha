/* ==========================================================
   ASHWAGANDHA — POLISHED INTERACTION LAYER
   Restores elegant animations, improves stability, and adds
   graceful media fallbacks without changing content structure.
========================================================== */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof window.gsap !== 'undefined';
const hasScrollTrigger = typeof window.ScrollTrigger !== 'undefined';

function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

onReady(() => {
  if (hasGSAP && hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.body.classList.toggle('reduced-motion', prefersReducedMotion);
  document.body.classList.add('loaded');

  initScrollProgress();
  initHeaderState();
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
  initPlant360Modal();
});

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
    bar.style.width = `${progress.toFixed(2)}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initHeaderState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

function initNavDots() {
  const buttons = Array.from(document.querySelectorAll('#nav-dots button'));
  const sections = Array.from(document.querySelectorAll('.section[data-section]'));
  if (!buttons.length || !sections.length) return;

  const normalise = (value) => (value === '1b' ? '1' : String(value));
  const byKey = new Map(sections.map(section => [normalise(section.dataset.section), section]));

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = byKey.get(normalise(btn.dataset.section));
      if (!target) return;
      smoothScrollTo(target);
    });
  });

  const setActive = (rawKey) => {
    const key = normalise(rawKey);
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === key));
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.dataset.section);
    });
  }, {
    threshold: 0.45,
    rootMargin: '-16% 0px -28% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

function smoothScrollTo(target) {
  const headerOffset = document.getElementById('site-header')?.offsetHeight || 74;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 18;
  window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas || prefersReducedMotion) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const section = document.getElementById('sec-0');
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 22 : 34;
  let width = 0;
  let height = 0;
  let rafId = 0;

  const palette = [
    'rgba(217,181,106,0.20)',
    'rgba(118,196,143,0.20)',
    'rgba(255,255,255,0.10)'
  ];

  function resize() {
    width = canvas.width = section?.offsetWidth || window.innerWidth;
    height = canvas.height = section?.offsetHeight || window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.6 + 1.2,
      dx: (Math.random() - 0.5) * 0.22,
      dy: -(Math.random() * 0.18 + 0.04),
      alpha: Math.random() * 0.45 + 0.12,
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function populate() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) particles.push(createParticle());
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      ctx.beginPath();
      ctx.fillStyle = p.color.replace(/0\.[0-9]+\)/, `${p.alpha})`);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    rafId = window.requestAnimationFrame(step);
  }

  canvas.style.display = 'block';
  resize();
  populate();
  step();
  window.addEventListener('resize', () => {
    resize();
    populate();
    cancelAnimationFrame(rafId);
    step();
  });
}

function initHeroTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;

  const label = 'Ashwagandha';
  if (prefersReducedMotion) {
    el.innerHTML = `${label}<span class="typing-cursor" aria-hidden="true"></span>`;
    return;
  }

  const cursor = '<span class="typing-cursor" aria-hidden="true"></span>';
  let index = 0;
  const type = () => {
    index += 1;
    el.innerHTML = `${label.slice(0, index)}${cursor}`;
    if (index < label.length) {
      window.setTimeout(type, index < 4 ? 95 : 75);
    }
  };

  el.innerHTML = cursor;
  window.setTimeout(type, 220);
}

function initHeroParallax() {
  const card = document.querySelector('.hero-image-card');
  const img = document.getElementById('hero-img');
  const orbOne = document.querySelector('.hero-orb-one');
  const orbTwo = document.querySelector('.hero-orb-two');
  const hero = document.getElementById('sec-0');
  if (!hero || (!card && !img)) return;

  if (!prefersReducedMotion) {
    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) - 0.5;
      const y = ((event.clientY - rect.top) / rect.height) - 0.5;

      if (card) card.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
      if (img && !img.classList.contains('is-hidden')) {
        img.style.transform = `translate3d(${x * -16}px, ${y * -12}px, 0) scale(1.03)`;
      }
      if (orbOne) orbOne.style.transform = `translate3d(${x * 18}px, ${y * 14}px, 0)`;
      if (orbTwo) orbTwo.style.transform = `translate3d(${x * -20}px, ${y * -16}px, 0)`;
    });

    hero.addEventListener('mouseleave', () => {
      [card, img, orbOne, orbTwo].forEach(el => {
        if (el) el.style.transform = '';
      });
    });
  }

  const onScroll = () => {
    const amount = Math.min(1, window.scrollY / Math.max(hero.offsetHeight, 1));
    if (img && !img.classList.contains('is-hidden')) {
      img.style.transform = `translateY(${amount * 24}px) scale(${1.02 + amount * 0.04})`;
    }
  };

  if (!prefersReducedMotion) window.addEventListener('scroll', onScroll, { passive: true });
}

function initGSAPAnimations() {
  const targets = document.querySelectorAll('.gsap-fade, .gsap-up, .gsap-left, .gsap-right, .gsap-timeline');
  if (!targets.length) return;

  if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) {
    targets.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const config = {
    'gsap-fade': { from: { opacity: 0 }, to: { opacity: 1, duration: 0.85 } },
    'gsap-up': { from: { opacity: 0, y: 36 }, to: { opacity: 1, y: 0, duration: 0.9 } },
    'gsap-left': { from: { opacity: 0, x: -36 }, to: { opacity: 1, x: 0, duration: 0.9 } },
    'gsap-right': { from: { opacity: 0, x: 36 }, to: { opacity: 1, x: 0, duration: 0.9 } },
    'gsap-timeline': { from: { opacity: 0, y: 44 }, to: { opacity: 1, y: 0, duration: 0.95 } }
  };

  targets.forEach(el => {
    const key = Object.keys(config).find(name => el.classList.contains(name));
    if (!key) return;
    const delay = parseFloat(el.style.getPropertyValue('--delay')) || 0;
    const { from, to } = config[key];

    gsap.fromTo(el, from, {
      ...to,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 86%',
        once: true
      }
    });
  });
}

function initTimeline() {
  const line = document.getElementById('timeline-line');
  if (!line) return;

  if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) {
    line.style.transform = 'translateX(-50%) scaleY(1)';
    return;
  }

  gsap.fromTo(line, {
    scaleY: 0,
    transformOrigin: 'top center'
  }, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: line.parentElement,
      start: 'top 70%',
      end: 'bottom 75%',
      scrub: true
    }
  });
}

function initChemTooltips() {
  const tooltip = document.getElementById('chem-tooltip');
  if (!tooltip) return;
  const chips = document.querySelectorAll('.chem-chip[data-tooltip]');
  if (!chips.length) return;

  const isTouch = window.matchMedia('(hover: none)').matches;

  const positionTooltip = (event) => {
    const rect = tooltip.getBoundingClientRect();
    let left = event.clientX + 16;
    let top = event.clientY - rect.height / 2;
    if (left + rect.width > window.innerWidth - 16) left = event.clientX - rect.width - 16;
    top = Math.max(16, Math.min(top, window.innerHeight - rect.height - 16));
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  };

  const showTooltip = (chip, event) => {
    tooltip.textContent = chip.dataset.tooltip;
    tooltip.classList.add('visible');
    if (event) positionTooltip(event);
  };

  const hideTooltip = () => tooltip.classList.remove('visible');

  chips.forEach(chip => {
    if (!isTouch) {
      chip.addEventListener('mouseenter', event => showTooltip(chip, event));
      chip.addEventListener('mousemove', positionTooltip);
      chip.addEventListener('mouseleave', hideTooltip);
    } else {
      chip.addEventListener('click', (event) => {
        event.stopPropagation();
        const alreadyVisible = tooltip.classList.contains('visible') && tooltip.textContent === chip.dataset.tooltip;
        if (alreadyVisible) hideTooltip();
        else showTooltip(chip, {
          clientX: event.clientX || window.innerWidth / 2,
          clientY: event.clientY || window.innerHeight / 2
        });
      });
    }
  });

  document.addEventListener('click', hideTooltip);
}

function initChemGroupInfo() {
  const groups = document.querySelectorAll('.chem-group[data-group]');
  if (!groups.length) return;

  const data = {
    withanolides: {
      title: 'Withanolides',
      info: 'Steroidal lactones and the main hallmark compounds of Ashwagandha, linked with adaptogenic, anti-inflammatory, and neuroprotective activity.'
    },
    alkaloids: {
      title: 'Alkaloids',
      info: 'Nitrogen-containing natural compounds that contribute to neuromodulatory, calming, and biologically active effects.'
    },
    glycosides: {
      title: 'Glycosides',
      info: 'Sugar-bound compounds such as withanosides and sitoindosides associated with anti-stress and immunomodulatory effects.'
    },
    others: {
      title: 'Flavonoids & Sterols',
      info: 'Supportive antioxidant and protective compounds that strengthen the broader pharmacological profile.'
    }
  };

  let popup = document.getElementById('group-info-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'group-info-popup';
    popup.className = 'group-info-popup';
    document.body.appendChild(popup);
  }

  const showPopup = (groupKey, refEl) => {
    const content = data[groupKey];
    if (!content) return;
    popup.innerHTML = `<div class="group-info-title">${content.title}</div><p>${content.info}</p>`;
    popup.classList.add('visible');
    const rect = refEl.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 12;
    if (left + popupRect.width > window.innerWidth - 12) left = window.innerWidth - popupRect.width - 12;
    if (top + popupRect.height > window.innerHeight - 12) top = rect.top - popupRect.height - 12;
    popup.style.left = `${Math.max(12, left)}px`;
    popup.style.top = `${Math.max(12, top)}px`;
  };

  const hidePopup = () => popup.classList.remove('visible');

  groups.forEach(group => {
    const key = group.dataset.group;
    const heading = group.querySelector('h3');
    if (!heading || !key) return;
    heading.setAttribute('tabindex', '0');
    heading.addEventListener('click', (event) => {
      event.stopPropagation();
      const same = popup.classList.contains('visible') && popup.textContent.includes(data[key]?.title || '');
      if (same) hidePopup();
      else showPopup(key, heading);
    });
    heading.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      showPopup(key, heading);
    });
    heading.addEventListener('mouseleave', hidePopup);
    heading.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        showPopup(key, heading);
      }
    });
  });

  document.addEventListener('click', hidePopup);
}

function initMedProgressBars() {
  const bars = document.querySelectorAll('.med-bar');
  if (!bars.length) return;

  if (!hasGSAP || !hasScrollTrigger || prefersReducedMotion) {
    bars.forEach(bar => {
      bar.style.width = bar.style.getPropertyValue('--w') || '100%';
    });
    return;
  }

  bars.forEach(bar => {
    const width = bar.style.getPropertyValue('--w') || '100%';
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(bar, {
        width,
        duration: 1.2,
        ease: 'power3.out'
      })
    });
  });
}

function initTradCards() {
  document.querySelectorAll('.trad-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    const toggle = (event) => {
      if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
      if (event.type === 'keydown') event.preventDefault();
      card.classList.toggle('flipped');
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', toggle);
  });
}

function initMisconceptionCards() {
  const cards = document.querySelectorAll('.flip-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Tap to flip');

    const toggle = (event) => {
      if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
      if (event.type === 'keydown') event.preventDefault();
      const shouldOpen = !card.classList.contains('is-flipped');
      cards.forEach(item => item.classList.remove('is-flipped'));
      if (shouldOpen) card.classList.add('is-flipped');
    };

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', toggle);
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.accord-item');
  if (!items.length) return;

  items.forEach(item => {
    const button = item.querySelector('.accord-btn');
    const body = item.querySelector('.accord-body');
    if (!button || !body) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(other => {
        other.classList.remove('open');
        const otherBody = other.querySelector('.accord-body');
        if (otherBody) otherBody.style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    });
  });

  const first = items[0];
  const firstBody = first?.querySelector('.accord-body');
  if (first && firstBody) {
    first.classList.add('open');
    firstBody.style.maxHeight = `${firstBody.scrollHeight}px`;
  }
}

function initViewer360() {
  const stage = document.getElementById('viewer-stage');
  const img = document.getElementById('viewer-img');
  const slider = document.getElementById('viewer-slider');
  const resetBtn = document.getElementById('viewer-reset');
  const frameNum = document.getElementById('viewer-frame-num');
  if (!stage || !img) return;

  const totalFrames = 9;
  const sensitivity = 18;
  const frameSources = Array.from({ length: totalFrames }, (_, i) => `assets/products/product-360/product-${i + 1}.webp`);

  let currentFrame = 0;
  let dragStartX = 0;
  let dragStartFrame = 0;
  let isDragging = false;
  let activePointerId = null;
  let hasAssets = true;

  const showFallback = () => {
    hasAssets = false;
    stage.classList.add('viewer-fallback');
    img.classList.add('is-hidden');
    const fallback = stage.querySelector('.viewer-fallback-text');
    if (fallback) fallback.style.display = 'flex';
    if (slider) slider.disabled = true;
    if (resetBtn) resetBtn.disabled = true;
  };

  frameSources.forEach(src => {
    const preload = new Image();
    preload.src = src;
  });

  function setFrame(index) {
    if (!hasAssets) return;
    currentFrame = ((index % totalFrames) + totalFrames) % totalFrames;
    img.src = frameSources[currentFrame];
    if (slider) slider.value = String(currentFrame);
    if (frameNum) frameNum.textContent = String(currentFrame + 1);
  }

  function beginDrag(clientX, pointerId = null) {
    if (!hasAssets) return;
    isDragging = true;
    activePointerId = pointerId;
    dragStartX = clientX;
    dragStartFrame = currentFrame;
    stage.classList.add('is-dragging');
  }

  function updateDrag(clientX) {
    if (!hasAssets) return;
    const delta = clientX - dragStartX;
    const frameDelta = Math.round(delta / sensitivity);
    setFrame(dragStartFrame + frameDelta);
  }

  function endDrag(pointerId = null) {
    if (pointerId !== null && activePointerId !== null && pointerId !== activePointerId) return;
    isDragging = false;
    activePointerId = null;
    stage.classList.remove('is-dragging');
  }

  if (slider) slider.addEventListener('input', () => setFrame(Number(slider.value) || 0));
  if (resetBtn) resetBtn.addEventListener('click', () => setFrame(0));

  if (window.PointerEvent) {
    stage.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      beginDrag(event.clientX, event.pointerId);
      if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
    });

    stage.addEventListener('pointermove', (event) => {
      if (!isDragging || (activePointerId !== null && event.pointerId !== activePointerId)) return;
      updateDrag(event.clientX);
    });

    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => {
      stage.addEventListener(type, (event) => endDrag(event.pointerId));
    });
  }

  img.addEventListener('error', showFallback);
  img.addEventListener('load', () => {
    stage.classList.remove('viewer-fallback');
    img.classList.remove('is-hidden');
  });

  setFrame(0);
}

function initStatCounters() {
  const counters = document.querySelectorAll('.c-stat-num[data-target]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion || !hasGSAP || !hasScrollTrigger) {
      el.textContent = target.toLocaleString();
      return;
    }

    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(counter.value).toLocaleString();
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  };

  counters.forEach(animateCounter);
}

function initSmoothScrollLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      smoothScrollTo(target);
    });
  });
}

function createFallbackMarkup(icon, title, subtitle = '') {
  return `
    <div class="media-fallback">
      <i class="fa-solid ${icon}"></i>
      <strong>${title}</strong>
      ${subtitle ? `<span>${subtitle}</span>` : ''}
    </div>
  `;
}

function initImageFallbacks() {
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    const heroCard = heroImg.closest('.hero-image-card');
    const heroFrame = heroImg.closest('.hero-image-frame');
    const applyHeroFallback = () => {
      if (!heroCard || !heroFrame || heroCard.classList.contains('is-fallback')) return;
      heroCard.classList.add('is-fallback');
      heroImg.classList.add('is-hidden');
      heroFrame.innerHTML = `
        <div class="hero-fallback-art">
          <i class="fa-solid fa-seedling"></i>
          <strong>Withania Somnifera</strong>
          <span>Elegant botanical presentation layout ready even when the hero media is unavailable.</span>
        </div>
      `;
    };

    if (!heroImg.complete || heroImg.naturalWidth === 0) {
      heroImg.addEventListener('error', applyHeroFallback);
    }
    heroImg.addEventListener('error', applyHeroFallback);
  }

  [
    { id: 'img-capsules', icon: 'fa-capsules', title: 'Capsule product visual', subtitle: 'Fallback preview active' },
    { id: 'img-powder', icon: 'fa-mortar-pestle', title: 'Powder product visual', subtitle: 'Fallback preview active' }
  ].forEach(item => {
    const img = document.getElementById(item.id);
    if (!img) return;
    img.addEventListener('error', () => {
      const wrap = img.closest('.dosage-img-wrap');
      if (!wrap) return;
      wrap.innerHTML = createFallbackMarkup(item.icon, item.title, item.subtitle);
    });
  });

  document.querySelectorAll('.team-avatar').forEach(img => {
    const wrap = img.closest('.team-avatar-wrap');
    const fallback = wrap?.querySelector('.team-avatar-fallback');
    const apply = () => {
      img.classList.add('is-hidden');
      if (wrap) wrap.classList.add('has-fallback');
      if (fallback) fallback.style.opacity = '1';
    };
    img.addEventListener('error', apply);
    if (img.complete && img.naturalWidth === 0) apply();
  });

  const instructorAvatar = document.querySelector('.instructor-avatar');
  if (instructorAvatar) {
    const wrap = instructorAvatar.closest('.instructor-avatar-wrap');
    const fallback = wrap?.querySelector('.instructor-avatar-fallback');
    const apply = () => {
      instructorAvatar.classList.add('is-hidden');
      if (wrap) wrap.classList.add('has-fallback');
      if (fallback) fallback.style.opacity = '1';
    };
    instructorAvatar.addEventListener('error', apply);
    if (instructorAvatar.complete && instructorAvatar.naturalWidth === 0) apply();
  }

  document.querySelectorAll('.header-logo').forEach(logo => {
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
    });
  });
}

function initPlant360Modal() {
  const openBtn = document.getElementById('p3d-open-btn');
  const modal = document.getElementById('p3d-modal');
  const closeBtn = document.getElementById('p3d-close-btn');
  const modelEl = document.getElementById('plant-model');
  const loadDiv = document.getElementById('p3d-loading');
  const loadBar = document.getElementById('p3d-load-bar');
  const loadPct = document.getElementById('p3d-pct');
  const tutorial = document.getElementById('p3d-tutorial');
  const skipBtn = document.getElementById('p3d-skip-btn');
  const nextBtn = document.getElementById('p3d-tut-next');
  const autoBtn = document.getElementById('p3d-auto-btn');
  const autoLbl = document.getElementById('p3d-auto-label');
  const resetBtn = document.getElementById('p3d-reset-btn');
  if (!modal || !modelEl) return;

  let modelLoaded = false;
  let tutorialStep = 0;
  let autoRotate = false;
  const steps = Array.from(document.querySelectorAll('.p3d-tut-step'));
  const dots = Array.from(document.querySelectorAll('.p3d-dot'));

  const updateTutorial = () => {
    steps.forEach((step, index) => step.classList.toggle('active', index === tutorialStep));
    dots.forEach((dot, index) => dot.classList.toggle('active', index === tutorialStep));
    if (nextBtn) {
      nextBtn.innerHTML = tutorialStep === steps.length - 1
        ? 'Got it <i class="fa-solid fa-check"></i>'
        : 'Next <i class="fa-solid fa-chevron-right"></i>';
    }
  };

  const hideTutorial = () => tutorial?.classList.add('hidden');

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    tutorialStep = 0;
    if (tutorial && !prefersReducedMotion) {
      tutorial.classList.remove('hidden');
      updateTutorial();
    }
    if (!modelLoaded && typeof modelEl.dismissPoster === 'function') {
      modelEl.dismissPoster();
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const setAutoRotate = (enabled) => {
    autoRotate = enabled;
    if (enabled) {
      modelEl.setAttribute('auto-rotate', '');
      autoBtn?.classList.add('active');
      if (autoLbl) autoLbl.textContent = 'Auto Rotate On';
    } else {
      modelEl.removeAttribute('auto-rotate');
      autoBtn?.classList.remove('active');
      if (autoLbl) autoLbl.textContent = 'Auto Rotate';
    }
  };

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  modelEl.addEventListener('progress', (event) => {
    const progress = Math.round((event.detail.totalProgress || 0) * 100);
    if (loadBar) loadBar.style.width = `${progress}%`;
    if (loadPct) loadPct.textContent = `${progress}%`;
  });

  modelEl.addEventListener('load', () => {
    modelLoaded = true;
    if (loadBar) loadBar.style.width = '100%';
    if (loadPct) loadPct.textContent = '100%';
    window.setTimeout(() => loadDiv?.classList.add('hidden'), 350);
  });

  modelEl.addEventListener('error', () => {
    if (loadPct) {
      loadPct.textContent = 'Model unavailable';
      loadPct.style.color = '#ef4444';
    }
  });

  nextBtn?.addEventListener('click', () => {
    tutorialStep += 1;
    if (tutorialStep >= steps.length) {
      hideTutorial();
      return;
    }
    updateTutorial();
  });

  skipBtn?.addEventListener('click', hideTutorial);
  modelEl.addEventListener('camera-change', hideTutorial);

  autoBtn?.addEventListener('click', () => setAutoRotate(!autoRotate));
  resetBtn?.addEventListener('click', async () => {
    try {
      await modelEl.resetTurntableRotation?.();
    } catch (_) {
      // no-op
    }
    try {
      modelEl.cameraOrbit = '0deg 75deg auto';
    } catch (_) {
      // no-op
    }
  });

  updateTutorial();
  if (tutorial) tutorial.classList.add('hidden');
}
