/**
 * M.M. Engineering Works - Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initContactForm();
  initPortfolio();
});

/**
 * Navigation & Header Logic
 */
function initNavigation() {
  const header = document.querySelector('header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      // Toggle menu icon
      menuToggle.innerHTML = isExpanded 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }

  // Active Navigation Link Highlighting
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop() || 'index.html';
  
  const navItems = document.querySelectorAll('.nav-link');
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref === pageName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Contact Form Logic
 */
function initContactForm() {
  const form = document.getElementById('inquiryForm');
  const toast = document.getElementById('toast');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple Validation
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !phone || !email || !service || !message) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    // Email Pattern Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone Pattern Validation (Min 10 digits)
    const phonePattern = /^\+?[0-9\s-]{10,15}$/;
    if (!phonePattern.test(phone.replace(/\s+/g, ''))) {
      alert('Please enter a valid phone number (minimum 10 digits).');
      return;
    }

    // Submit Action (Simulation)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Inquiry...';

    setTimeout(() => {
      // Show Success Toast
      if (toast) {
        toast.classList.add('active');
        setTimeout(() => {
          toast.classList.remove('active');
        }, 5000);
      }

      // Reset Form
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1200);
  });
}

/**
 * Portfolio Filtering & Lightbox Logic
 */
function initPortfolio() {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll('.portfolio-item'));
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  // 1. Filtering Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons, add to clicked
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 2. Lightbox Modal Logic
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeItems = [...items]; // Currently filtered items
  let currentIndex = 0;

  // Open Lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      // Refresh list of currently visible/active items for navigating in lightbox
      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
      activeItems = items.filter(i => activeFilter === 'all' || i.getAttribute('data-category') === activeFilter);
      
      currentIndex = activeItems.indexOf(item);
      updateLightboxContent();
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  // Update content inside Lightbox
  function updateLightboxContent() {
    const currentItem = activeItems[currentIndex];
    if (!currentItem) return;

    const img = currentItem.querySelector('img');
    const title = currentItem.querySelector('h4').textContent;
    const category = currentItem.querySelector('p').textContent;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.innerHTML = `<strong>${title}</strong> &mdash; ${category}`;
  }

  // Close Lightbox
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });

  // Navigation arrows
  function navigateLightbox(direction) {
    currentIndex += direction;
    if (currentIndex >= activeItems.length) {
      currentIndex = 0;
    } else if (currentIndex < 0) {
      currentIndex = activeItems.length - 1;
    }
    updateLightboxContent();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }
}
