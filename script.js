document.addEventListener('DOMContentLoaded', () => {

  // --- Helper function to convert hex to RGB ---
  function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length == 4) { // 3-digit hex
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    } else if (hex.length == 7) { // 6-digit hex
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
    return `${+r},${+g},${+b}`;
  }

  // --- Set CSS Variables for RGB colors (for RGBA opacity) ---
  const root = document.documentElement;
  function updateRgbVars() {
    const computedStyles = getComputedStyle(root);
    // Use fallback values if CSS variables are not found
    const bg = computedStyles.getPropertyValue('--color-bg').trim() || '#f6fbff';
    const accent = computedStyles.getPropertyValue('--color-accent').trim() || '#2563eb';
    
    // Check if it's a hex color
    if (bg.startsWith('#')) {
      root.style.setProperty('--color-bg-rgb', hexToRgb(bg));
    }
    if (accent.startsWith('#')) {
      root.style.setProperty('--color-accent-rgb', hexToRgb(accent));
    }
  }

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // Get saved theme or use system preference
  let currentTheme = localStorage.getItem('theme');
  if (!currentTheme) {
    currentTheme = prefersDark.matches ? 'dark' : 'light';
  }
  root.classList.toggle('dark', currentTheme === 'dark');
  
  updateRgbVars(); // Initial call

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('dark');
    localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
    updateRgbVars(); // Update RGB vars on theme change
  });

  // Listen for system theme changes
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      root.classList.toggle('dark', e.matches);
      updateRgbVars();
    }
  });


  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.nav');

  mobileToggle.addEventListener('click', () => {
    if (!nav) return;
    const isActive = nav.classList.toggle('active');
    mobileToggle.setAttribute('aria-expanded', isActive);
  });

  // Close mobile menu when a nav link is clicked
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      }
    });
  });

  // --- Set current year in footer ---
  document.getElementById('year').textContent = new Date().getFullYear();

  // --- Intersection Observer for Fade-in Animations ---
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  fadeElements.forEach(el => fadeObserver.observe(el));
  
  // --- ADDED BACK: Animate skill bars when in viewport ---
  const skillBars = document.querySelectorAll('.skill-bar');
  const animateSkill = (el) => {
    const percent = el.getAttribute('data-percent') || '0';
    const inner = el.querySelector('span');
    if (inner) {
      inner.style.width = percent + '%';
    }
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkill(entry.target);
        skillObserver.unobserve(entry.target); // Animate only once
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach(sb => skillObserver.observe(sb));

  // --- Back to Top Button ---
  const backToTop = document.querySelector('.back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  // --- Formspree Contact Form ---
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    if (!statusEl) return; // Exit if status element not found
    
    statusEl.textContent = 'Sending...';
    statusEl.style.color = 'var(--color-muted)';
    
    try {
      const response = await fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        statusEl.textContent = 'Message sent successfully!';
        statusEl.style.color = 'var(--color-secondary)';
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.hasOwn(responseData, 'errors')) {
          statusEl.textContent = responseData.errors.map(error => error.message).join(', ');
        } else {
          statusEl.textContent = 'Oops! There was a problem.';
        }
        statusEl.style.color = '#f87171'; // Error color
      }
    } catch (error) {
      statusEl.textContent = 'Oops! Network error. Please try again.';
      statusEl.style.color = '#f87171';
    }
  }
  
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // --- Resume Modal Logic (NEW) ---
  const viewResumeBtn = document.getElementById('viewResumeBtn');
  const resumeModal = document.getElementById('resumeModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const body = document.body;

  function openModal() {
    resumeModal.classList.add('visible');
    resumeModal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
  }

  function closeModal() {
    resumeModal.classList.remove('visible');
    resumeModal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  }

  if (viewResumeBtn && resumeModal && closeModalBtn) {
    // Open modal
    viewResumeBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Stop any default link behavior
      openModal();
    });

    // Close with button
    closeModalBtn.addEventListener('click', closeModal);

    // Close by clicking the overlay
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeModal();
      }
    });

    // Close with "Escape" key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('visible')) {
        closeModal();
      }
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});


