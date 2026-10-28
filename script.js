const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Reduced-motion: stop the looping background video
const heroVideo = document.querySelector('.header-background video');
if (heroVideo && prefersReducedMotion.matches) {
  heroVideo.removeAttribute('autoplay');
  heroVideo.pause();
}

// Smooth scrolling
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function smoothScrollTo(target, duration = 1000) {
  const startPosition = window.pageYOffset;
  const distance = target.getBoundingClientRect().top; // relative to the viewport
  if (prefersReducedMotion.matches) {
    window.scrollTo(0, startPosition + distance);
    return;
  }
  let startTime = null;
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(animation);
  }
  requestAnimationFrame(animation);
}

// Any link like <a href="#projects"> (the modal "View Details" links use href="#", so skip those)
document.querySelectorAll('a[href^="#"]:not(.project-link)').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    smoothScrollTo(target);
  });
});

// Header shrink effect on scroll
const header = document.querySelector('header');
function updateHeader() {
  header.classList.toggle('shrink', window.scrollY > 100);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Modals
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
let activeModal = null;
let lastTrigger = null;
let closeTimer = null;

function openModal(modal, trigger) {
  clearTimeout(closeTimer);
  lastTrigger = trigger || null;
  activeModal = modal;
  modal.style.display = 'flex';
  document.body.classList.add('modal-open'); // locks background scroll
  setTimeout(() => {
    modal.classList.add('show');
    const closeBtn = modal.querySelector('.close');
    if (closeBtn) closeBtn.focus();
  }, 10);
}

function closeModal(modal) {
  modal.classList.remove('show');
  closeTimer = setTimeout(() => {
    modal.style.display = 'none';
    if (activeModal === modal) {
      activeModal = null;
      document.body.classList.remove('modal-open');
      if (lastTrigger) lastTrigger.focus();
    }
  }, 300); // wait for the fade-out transition
}

document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const modal = document.getElementById(this.getAttribute('data-modal'));
    if (modal) openModal(modal, this);
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  // Close button
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));

  // Click on the dark backdrop
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });
});

document.addEventListener('keydown', e => {
  if (!activeModal) return;

  if (e.key === 'Escape') {
    closeModal(activeModal);
    return;
  }


  if (e.key === 'Tab') {
    const items = [...activeModal.querySelectorAll(FOCUSABLE)];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
