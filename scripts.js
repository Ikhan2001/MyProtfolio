/* scripts.js
   Handles theme toggle, skill bar animations, simple contact form behavior,
   and a tiny mobile menu.
*/

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

  // Mobile menu toggle (simple)
  const mobileToggle = document.getElementById('mobileMenuToggle');
  mobileToggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const isVisible = getComputedStyle(nav).display !== 'none';
    nav.style.display = isVisible ? 'none' : 'flex';
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
      return;
    }

    // Fake sending: show success message and clear form
    statusEl.textContent = 'Sending message…';
    setTimeout(() => {
      statusEl.textContent = 'Thanks! Your message was sent (demo). I will get back to you soon.';
      form.reset();
    }, 900);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

});
