/* ============================================================
   OptiLux â€” Main JavaScript
   main.js â€” Core: Theme, Nav, Scroll, Cursor, Reveal, Toast
   ============================================================ */

'use strict';

// â”€â”€â”€ Preloader â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 1600);
  }
});

// â”€â”€â”€ Theme Manager â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ThemeManager = (() => {
  const root = document.documentElement;
  const STORAGE_KEY = 'optilux-theme';
  let current = localStorage.getItem(STORAGE_KEY) || 'light';

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    current = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggles();
  };

  const toggle = () => apply(current === 'light' ? 'dark' : 'light');

  const updateToggles = () => {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon) sunIcon.style.display = current === 'dark' ? 'inline-flex' : 'none';
      if (moonIcon) moonIcon.style.display = current === 'light' ? 'inline-flex' : 'none';
      btn.setAttribute('title', current === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
    });
  };

  const init = () => {
    apply(current);
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init, toggle, current: () => current };
})();

// â”€â”€â”€ RTL Manager â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RTLManager = (() => {
  const STORAGE_KEY = 'optilux-rtl';
  let isRTL = localStorage.getItem(STORAGE_KEY) === 'true';

  const apply = () => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    localStorage.setItem(STORAGE_KEY, isRTL);
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.title = isRTL ? 'Switch to LTR' : 'Switch to RTL';
      btn.textContent = isRTL ? 'LTR' : 'RTL';
    });
  };

  const toggle = () => {
    isRTL = !isRTL;
    apply();
  };

  const init = () => {
    apply();
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  };

  return { init };
})();

// â”€â”€â”€ Navbar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Navbar = (() => {
  const init = () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!navbar) return;

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });

    // Hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      const isBlogDetails = (currentPage === 'blog-details.html' && href === 'blog.html');
      if (href === currentPage || (currentPage === '' && href === 'index.html') || isBlogDetails) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  return { init };
})();

// ─── Profile Dropdown ──────────────────────────────
const ProfileDropdown = (() => {
  const init = () => {
    const profileBtn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('profile-dropdown');
    if (!profileBtn || !dropdown) return;

    const toggle = (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      profileBtn.setAttribute('aria-expanded', isOpen);
      dropdown.setAttribute('aria-hidden', !isOpen);
    };

    const close = () => {
      dropdown.classList.remove('open');
      profileBtn.setAttribute('aria-expanded', 'false');
      dropdown.setAttribute('aria-hidden', 'true');
    };

    profileBtn.addEventListener('click', toggle);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
        close();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
      }
    });

    // Keyboard accessibility for links
    const links = dropdown.querySelectorAll('a');
    if (links.length > 0) {
      links[links.length - 1].addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          close();
        }
      });
      links[0].addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && e.shiftKey) {
          close();
        }
      });
    }
  };

  return { init };
})();

// ─── Hero Slider ──────────────────────────────────
const HeroSlider = (() => {
  const init = (el) => {
    if (!el) return;
    const slides = el.querySelectorAll('.slide');
    const dots = el.querySelectorAll('.slider-dot');
    const prevBtn = el.querySelector('.slider-prev');
    const nextBtn = el.querySelector('.slider-next');
    if (!slides.length) return;

    let current = 0;
    let timer = null;
    let isTransitioning = false;
    let touchStartX = 0;

    const goTo = (idx) => {
      if (isTransitioning || idx === current) return;
      isTransitioning = true;
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      setTimeout(() => { isTransitioning = false; }, 900);
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAuto = () => { timer = setInterval(next, 5500); };
    const stopAuto = () => clearInterval(timer);

    dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));
    nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
    prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
      if (e.key === 'ArrowLeft') { stopAuto(); prev(); startAuto(); }
    });

    // Touch / Swipe
    el.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
    }, { passive: true });

    // Pause on hover
    el.addEventListener('mouseenter', stopAuto);
    el.addEventListener('mouseleave', startAuto);

    // Init
    slides[0]?.classList.add('active');
    dots[0]?.classList.add('active');
    startAuto();
  };

  return { init };
})();

// â”€â”€â”€ Scroll Reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ScrollReveal = (() => {
  const init = () => {
    const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    items.forEach(item => observer.observe(item));
  };

  return { init };
})();

// â”€â”€â”€ Counter Animation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CounterAnimation = (() => {
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const init = () => {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  };

  return { init };
})();

// â”€â”€â”€ FAQ Accordion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FAQ = (() => {
  const init = () => {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Tab System â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Tabs = (() => {
  const init = () => {
    document.querySelectorAll('.tab-nav').forEach(nav => {
      const buttons = nav.querySelectorAll('.tab-btn');
      const container = nav.closest('[data-tabs]') || nav.nextElementSibling?.parentElement;

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const panel = container?.querySelector(`[data-tab-content="${target}"]`) ||
                        document.getElementById(target);
          if (panel) {
            const allPanels = panel.parentElement.querySelectorAll('.tab-content');
            allPanels.forEach(p => p.classList.remove('active'));
            panel.classList.add('active');
          }
        });
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Filter Gallery â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FilterGallery = (() => {
  const init = () => {
    document.querySelectorAll('.filter-nav').forEach(nav => {
      const btns = nav.querySelectorAll('.filter-btn');
      const container = nav.nextElementSibling;
      if (!container) return;

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const filter = btn.dataset.filter;
          container.querySelectorAll('[data-category]').forEach(item => {
            const show = filter === 'all' || item.dataset.category === filter;
            item.style.display = show ? '' : 'none';
            item.style.opacity = show ? '1' : '0';
          });
        });
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Lightbox â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Lightbox = (() => {
  let overlay, imgEl;

  const open = (src, alt = '') => {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = `
        <div class="lightbox-inner">
          <button class="lightbox-close" title="Close">âœ•</button>
          <img src="" alt="" />
        </div>`;
      document.body.appendChild(overlay);
      overlay.querySelector('.lightbox-close').addEventListener('click', close);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
      imgEl = overlay.querySelector('img');
    }
    imgEl.src = src;
    imgEl.alt = alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        const src = el.dataset.lightbox || el.querySelector('img')?.src;
        const alt = el.dataset.alt || '';
        if (src) open(src, alt);
      });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  };

  return { init, open, close };
})();

// â”€â”€â”€ Custom Cursor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CustomCursor = (() => {
  const init = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    }, { passive: true });

    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(updateRing);
    };
    updateRing();

    document.querySelectorAll('a, button, .card, .product-card, [data-lightbox]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  };

  return { init };
})();

// â”€â”€â”€ Back to Top â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BackToTop = (() => {
  const init = () => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  return { init };
})();

// â”€â”€â”€ Reading Progress â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ReadingProgress = (() => {
  const init = () => {
    const bar = document.getElementById('page-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docH > 0 ? (window.scrollY / docH) * 100 : 0) + '%';
    }, { passive: true });
  };

  return { init };
})();

// â”€â”€â”€ Toast Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Toast = (() => {
  let container;

  const show = (msg, type = 'info', duration = 4000) => {
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'âœ“', error: 'âœ•', info: 'â„¹' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-msg">${msg}</span>
      <button class="toast-close">âœ•</button>`;
    container.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', () => remove(toast));
    setTimeout(() => remove(toast), duration);
  };

  const remove = (toast) => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(16px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  };

  return { show };
})();

// â”€â”€â”€ Password Toggle â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PasswordToggle = (() => {
  const init = () => {
    document.querySelectorAll('.input-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.textContent = isHidden ? 'ðŸ™ˆ' : 'ðŸ‘';
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Password Strength â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PasswordStrength = (() => {
  const check = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const levels = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const init = () => {
    document.querySelectorAll('[data-strength-input]').forEach(input => {
      const bars = input.closest('.form-group')?.querySelectorAll('.strength-bar') || [];
      const label = input.closest('.form-group')?.querySelector('.strength-label');
      input.addEventListener('input', () => {
        const score = input.value ? check(input.value) : 0;
        bars.forEach((bar, i) => {
          bar.className = 'strength-bar';
          if (i < score) bar.classList.add(levels[score]);
        });
        if (label) label.textContent = input.value ? (labels[score] || '') : '';
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Form Validation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FormValidator = (() => {
  const rules = {
    required: (val) => val.trim() !== '' || 'This field is required',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Enter a valid email',
    minLength: (len) => (val) => val.length >= len || `Minimum ${len} characters`,
    phone: (val) => /^[\d\s\+\-\(\)]{7,15}$/.test(val) || 'Enter a valid phone number',
  };

  const validate = (form) => {
    let valid = true;
    form.querySelectorAll('[data-validate]').forEach(input => {
      const ruleNames = input.dataset.validate.split(',');
      let error = '';
      for (const rName of ruleNames) {
        const [name, arg] = rName.trim().split(':');
        const rule = arg ? rules[name]?.(parseInt(arg)) : rules[name];
        const result = rule?.(input.value);
        if (result !== true && result !== undefined) { error = result; break; }
      }
      const errEl = input.parentElement.querySelector('.form-error') ||
                    input.nextElementSibling?.classList.contains('form-error') ? input.nextElementSibling : null;
      if (error) {
        input.classList.add('error');
        if (errEl) { errEl.textContent = error; errEl.style.display = 'block'; }
        valid = false;
      } else {
        input.classList.remove('error');
        if (errEl) errEl.style.display = 'none';
      }
    });
    return valid;
  };

  const init = () => {
    document.querySelectorAll('form[data-form]').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validate(form)) {
          const type = form.dataset.form;
          if (type === 'contact') Toast.show('Message sent! We\'ll respond within 24 hours. ðŸ‘“', 'success');
          if (type === 'booking') Toast.show('Appointment booked! Check your email for confirmation.', 'success');
          if (type === 'newsletter') Toast.show('Subscribed! Welcome to OptiLux updates.', 'success');
          if (type === 'login') Toast.show('Welcome back to OptiLux!', 'success');
          if (type === 'signup') Toast.show('Account created! Welcome to OptiLux.', 'success');
          form.reset();
        }
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Countdown Timer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Countdown = (() => {
  const init = () => {
    const el = document.getElementById('countdown');
    if (!el) return;
    const target = new Date(el.dataset.target || '2026-09-01T00:00:00');

    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) { el.innerHTML = '<p class="text-sapphire font-bold">We are LIVE! ðŸŽ‰</p>'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.querySelector('[data-days]').textContent = String(d).padStart(2, '0');
      el.querySelector('[data-hours]').textContent = String(h).padStart(2, '0');
      el.querySelector('[data-mins]').textContent = String(m).padStart(2, '0');
      el.querySelector('[data-secs]').textContent = String(s).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  };

  return { init };
})();

// â”€â”€â”€ Testimonial Carousel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TestimonialCarousel = (() => {
  const init = () => {
    document.querySelectorAll('[data-carousel]').forEach(carousel => {
      const track = carousel.querySelector('[data-carousel-track]');
      const slides = track?.children;
      if (!slides || slides.length === 0) return;

      const prev = carousel.querySelector('[data-carousel-prev]');
      const next = carousel.querySelector('[data-carousel-next]');
      let idx = 0;
      const total = slides.length;

      const getVisible = () => {
        const w = carousel.offsetWidth;
        if (w < 640) return 1;
        if (w < 1024) return 2;
        return 3;
      };

      const update = () => {
        const visible = getVisible();
        const maxIdx = Math.max(0, total - visible);
        idx = Math.min(idx, maxIdx);
        const slideW = 100 / visible;
        Array.from(slides).forEach((s, i) => {
          s.style.minWidth = slideW + '%';
        });
        track.style.transform = `translateX(-${idx * (100 / visible)}%)`;
        track.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
        if (prev) prev.disabled = idx === 0;
        if (next) next.disabled = idx >= maxIdx;
      };

      prev?.addEventListener('click', () => { if (idx > 0) { idx--; update(); } });
      next?.addEventListener('click', () => {
        const visible = getVisible();
        if (idx < total - visible) { idx++; update(); }
      });

      window.addEventListener('resize', update);
      update();
    });
  };

  return { init };
})();

// â”€â”€â”€ Smooth Anchor Scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height') || '80', 10);
          window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
        }
      });
    });
  };

  return { init };
})();

// â”€â”€â”€ Sticky Section Highlight â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SectionHighlight = (() => {
  const init = () => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
  };

  return { init };
})();

// â”€â”€â”€ Booking Date Picker â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Booking = (() => {
  const init = () => {
    const bookingForm = document.querySelector('form[data-form="booking"]');
    if (!bookingForm) return;

    const dateInput = bookingForm.querySelector('#booking-date');
    const hiddenTimeInput = bookingForm.querySelector('#selected-time');
    const timeSlots = bookingForm.querySelectorAll('.time-slot');

    const todayStr = new Date().toISOString().split('T')[0];
    if (dateInput) {
      dateInput.setAttribute('min', todayStr);
    }

    timeSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        timeSlots.forEach(s => {
          s.classList.remove('selected');
          s.style.background = 'rgba(255,255,255,0.08)';
          s.style.color = 'rgba(255,255,255,0.7)';
          s.style.borderColor = 'rgba(255,255,255,0.15)';
        });
        slot.classList.add('selected');
        slot.style.background = 'var(--sapphire)';
        slot.style.color = '#ffffff';
        slot.style.borderColor = 'var(--sapphire)';
        if (hiddenTimeInput) hiddenTimeInput.value = slot.textContent.trim();
      });
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();

      const nameInput = bookingForm.querySelector('#bk-name');
      const phoneInput = bookingForm.querySelector('#bk-phone');

      let isValid = true;

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        if (nameInput) nameInput.classList.add('error');
        isValid = false;
      } else {
        if (nameInput) nameInput.classList.remove('error');
      }

      // Validate Phone
      const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
      if (!phoneInput || !phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
        if (phoneInput) phoneInput.classList.add('error');
        isValid = false;
      } else {
        if (phoneInput) phoneInput.classList.remove('error');
      }

      // Validate Date
      if (!dateInput || !dateInput.value) {
        if (dateInput) dateInput.classList.add('error');
        isValid = false;
      } else if (dateInput.value < todayStr) {
        if (dateInput) dateInput.classList.add('error');
        Toast.show('Please select a future or today\'s date.', 'error');
        return;
      } else {
        if (dateInput) dateInput.classList.remove('error');
      }

      // Validate Time Slot
      const selectedTime = hiddenTimeInput ? hiddenTimeInput.value.trim() : '';
      if (!selectedTime) {
        isValid = false;
        Toast.show('Please select a preferred time slot.', 'info');
        return;
      }

      if (!isValid) {
        Toast.show('Please complete all required fields.', 'error');
        return;
      }

      // Successful Booking
      Toast.show(`Appointment booked for ${dateInput.value} at ${selectedTime}! Confirmation sent.`, 'success');

      // Reset form
      bookingForm.reset();
      if (hiddenTimeInput) hiddenTimeInput.value = '';
      timeSlots.forEach(s => {
        s.classList.remove('selected');
        s.style.background = 'rgba(255,255,255,0.08)';
        s.style.color = 'rgba(255,255,255,0.7)';
        s.style.borderColor = 'rgba(255,255,255,0.15)';
      });
    });
  };

  return { init };
})();

// ─── App Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  ProfileDropdown.init();
  ScrollReveal.init();
  CounterAnimation.init();
  FAQ.init();
  Tabs.init();
  FilterGallery.init();
  Lightbox.init();
  CustomCursor.init();
  BackToTop.init();
  ReadingProgress.init();
  PasswordToggle.init();
  PasswordStrength.init();
  FormValidator.init();
  Countdown.init();
  TestimonialCarousel.init();
  SmoothScroll.init();
  SectionHighlight.init();
  Booking.init();
  HeroSlider.init(document.querySelector('.hero-slider'));

  // Make Toast globally accessible
  window.OptiLuxToast = Toast;
});
