document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle (persist to localStorage)
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.classList.add('light');

  function updateThemeIcon() {
    themeToggle.textContent = root.classList.contains('light') ? '🌞' : '🌙';
  }
  updateThemeIcon();

  themeToggle.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    updateThemeIcon();
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileMenuToggle');
  mobileToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.toggle('active');
    mobileToggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.nav');
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        mobileToggle.textContent = '☰';
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Animate skill bars when in viewport
  const skillBars = document.querySelectorAll('.skill-bar');
  const animateSkill = (el) => {
    const percent = el.getAttribute('data-percent') || '0';
    const inner = el.querySelector('span');
    inner.style.width = percent + '%';
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateSkill(entry.target);
      }
    });
  }, {threshold: 0.25});

  skillBars.forEach(sb => observer.observe(sb));

  // Contact form handling
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const mailtoBtn = document.getElementById('mailtoFallback');

  // Fallback: open mail client with prefilled subject if JS "send" not wired
  mailtoBtn.addEventListener('click', () => {
    const name = encodeURIComponent(document.getElementById('name').value || '');
    const email = encodeURIComponent(document.getElementById('email').value || '');
    const message = encodeURIComponent(document.getElementById('message').value || '');
    const body = `From: ${name}%0AEmail: ${email}%0A%0A${message}`;
    window.location.href = `mailto:intkhabkhanofficial@gmail.com?subject=Portfolio%20Contact&body=${body}`;
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    // Basic UI feedback. For production, wire this to Formspree / Netlify forms / server endpoint.
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please fill in all fields.';
      statusEl.style.color = '#f87171';
      return;
    }

    // Fake sending: show success message and clear form
    statusEl.textContent = 'Sending message…';
    statusEl.style.color = 'var(--muted)';
    
    setTimeout(() => {
      statusEl.textContent = 'Thanks! Your message was sent (demo). I will get back to you soon.';
      statusEl.style.color = 'var(--accent)';
      form.reset();
    }, 900);
  });

  // Add fade-in animation to elements on scroll
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {threshold: 0.1});

  fadeElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });

  // Smooth scroll for anchor links
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