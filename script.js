// ===== Year in colophon =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Dark mode =====
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = stored || (prefersDark ? 'dark' : 'light');

setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', theme === 'dark');
  localStorage.setItem('theme', theme);
}

// ===== Mobile nav =====
const navBurger = document.getElementById('navBurger');
const mobileNav = document.getElementById('mobileNav');

navBurger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', isOpen);
});

mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.form-submit');
    const label = submitBtn.querySelector('.submit-label');
    const accessKey = contactForm.access_key.value;

    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      formStatus.textContent = 'Form isn\'t connected yet — add a Web3Forms access key in index.html (see README).';
      formStatus.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    label.textContent = 'Sending…';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const formData = new FormData(contactForm);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Message sent — thanks, I\'ll get back to you soon.';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (err) {
      formStatus.textContent = 'Couldn\'t send that — please try again or email me directly.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      label.textContent = 'Send message';
    }
  });
}

const lines = [
  'Content Strategist, Inlite Media.',
  'Publishing Manager Intern, Notion Press.',
  'MA Journalism, SRMIST \'26.',
  'Publishing × Marketing × AI.'
];
const typeEl = document.getElementById('typewriter');
let lineIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = lines[lineIndex];
  if (!deleting) {
    charIndex++;
    typeEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typeEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      lineIndex = (lineIndex + 1) % lines.length;
    }
  }
  setTimeout(typeLoop, deleting ? 28 : 42);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  typeLoop();
} else {
  typeEl.textContent = lines[0];
  typeEl.style.borderRight = 'none';
}
