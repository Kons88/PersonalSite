// Smooth scrolling with custom easing function
document.querySelector('.scroll-button').addEventListener('click', function (e) {
  e.preventDefault(); // Prevent default anchor behavior
  const target = document.querySelector(this.getAttribute('href')); // Get the target element
  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset; // Calculate target position
  const startPosition = window.pageYOffset; // Current scroll position
  const distance = targetPosition - startPosition; // Distance to scroll
  const duration = 1000; // Duration of the scroll animation in milliseconds
  let startTime = null;

  // Easing function for smooth scrolling
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // Animation function
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(Math.min(timeElapsed / duration, 1)); // Apply easing function
    window.scrollTo(0, startPosition + distance * run); // Scroll to the calculated position

    if (timeElapsed < duration) {
      requestAnimationFrame(animation); // Continue animation until duration is reached
    }
  }

  requestAnimationFrame(animation); // Start the animation
});

// Header shrink effect on scroll
window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  const scrollPosition = window.scrollY;

  if (scrollPosition > 100) { // Adjust this value as needed
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

document.querySelector('.link').addEventListener('click', function(event) {
  // Allow the link to work as expected
});


// Open modal when "View Details" is clicked
document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('show'), 10); // Add show class after display is set
  });
});

// Close modal when the close button is clicked
document.querySelectorAll('.close').forEach(closeButton => {
  closeButton.addEventListener('click', function () {
    const modal = this.closest('.modal');
    modal.classList.remove('show');
    setTimeout(() => (modal.style.display = 'none'), 300); // Wait for transition to finish
  });
});

// Close modal when clicking outside of it
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function (e) {
    if (e.target === modal) { // Check if the click is on the modal background
      modal.classList.remove('show');
      setTimeout(() => (modal.style.display = 'none'), 300); // Wait for transition to finish
    }
  });
});
