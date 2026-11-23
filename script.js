/* ===== 1. MOBILE MENU ===== */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
// Close the menu after tapping a link
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

/* ===== 2. SCROLL REVEAL ===== */
const revealer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); revealer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

/* ===== 3. HIGHLIGHT THE CURRENT SECTION IN THE MENU ===== */
const links = document.querySelectorAll('nav a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

/* ===== 4. 3D HERO FOLLOWS THE MOUSE ===== */
const scene = document.getElementById('tilt3d');
window.addEventListener('mousemove', e => {
  scene.style.setProperty('--ry', (e.clientX / innerWidth - 0.5) * 50 + 'deg');
  scene.style.setProperty('--rx', -(e.clientY / innerHeight - 0.5) * 50 + 'deg');
});

/* ===== 5. 3D TILT ON CARDS (desktop hover) ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== 6. FLOATING PARTICLE BACKGROUND ===== */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, dots = [];

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  const count = Math.min(70, Math.floor(W / 18));
  dots = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
  }));
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  dots.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.fillStyle = 'rgba(120,170,255,.8)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2); ctx.fill();
    for (let j = i + 1; j < dots.length; j++) {
      const q = dots[j], d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 130) {
        ctx.strokeStyle = `rgba(139,92,246,${0.25 - d / 520})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
      }
    }
  });
  requestAnimationFrame(animate);
}
resize();
window.addEventListener('resize', resize);
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) animate();

/* ===== 7. CONTACT FORM + EMAIL DELIVERY ===== */
const form = document.getElementById('form');
const ok = document.getElementById('ok');

/*
  SETUP:
  1. Create a free form at https://formspree.io/
  2. Verify the Gmail inbox where you want to receive enquiries.
  3. Create a form and copy its endpoint, e.g. https://formspree.io/f/abcdwxyz
  4. Replace the placeholder below with your real endpoint.
*/
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/moedpded';

const rules = {
  name:    v => v.trim().length >= 2 || 'Please enter your name.',
  email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email address.',
  service: v => v !== '' || 'Please choose a service.',
  message: v => v.trim().length >= 10 || 'Please write at least 10 characters.'
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  let valid = true;

  for (const id in rules) {
    const field = form.elements[id];
    const result = rules[id](field.value);
    field.parentElement.querySelector('.err').textContent =
      result === true ? '' : result;
    if (result !== true) valid = false;
  }

  if (!valid) {
    ok.textContent = '';
    return;
  }

  if (FORMSPREE_ENDPOINT.includes('REPLACE_WITH_YOUR_FORM_ID')) {
    ok.textContent = 'The contact form is not connected yet. Please add your Formspree endpoint in script.js.';
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  ok.textContent = '';

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) throw new Error('Message delivery failed');

    ok.textContent = 'Thank you, ' + form.elements.name.value.trim() +
      '! Your message has been sent successfully. We will get back to you soon.';
    form.reset();
  } catch (error) {
    ok.textContent = 'Sorry, your message could not be sent. Please try again in a moment.';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});

/* ===== 8. FOOTER YEAR ===== */
document.getElementById('yr').textContent = new Date().getFullYear();
