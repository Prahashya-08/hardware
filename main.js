/**
 * M.M. Engineering Works - Unified JS Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global Layout Utilities (Header scroll, mobile menu, navigation highlighting)
  initNavigation();
  
  // Page-specific Features (Self-detecting)
  initAntigravityCarousel();
  initContactForm();
  initPortfolio();
});

/**
 * Global Navigation & Header Scroll Behavior
 */
function initNavigation() {
  const header = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggleBtn');
  const navLinks = document.getElementById('navMenu');
  
  // Sticky Header on Scroll
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

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
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }

  // Active Navigation Highlight based on path
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
 * Homepage "Antigravity" Carousel Logic (Self-detecting)
 */
function initAntigravityCarousel() {
  const canvas = document.getElementById('appCanvas');
  if (!canvas) return; // Exit if not on index.html

  const navBtns = document.querySelectorAll('.nav-btn');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const prevBtn = document.getElementById('prevSlideBtn');
  const nextBtn = document.getElementById('nextSlideBtn');
  
  const slideOverlays = [
    document.getElementById('slide1Overlay'),
    document.getElementById('slide2Overlay'),
    document.getElementById('slide3Overlay')
  ];

  let currentSlide = 1;

  function goToSlide(slideNum) {
    if (slideNum < 1 || slideNum > 3) return;
    
    currentSlide = slideNum;

    // Update state class on canvas
    canvas.classList.remove('state-products', 'state-about', 'state-contact');
    if (currentSlide === 1) {
      canvas.classList.add('state-products');
    } else if (currentSlide === 2) {
      canvas.classList.add('state-about');
    } else if (currentSlide === 3) {
      canvas.classList.add('state-contact');
    }

    // Update active nav button highlighting
    navBtns.forEach(btn => {
      const targetSlide = parseInt(btn.getAttribute('data-slide'));
      if (btn.id === 'navFaq') {
        if (currentSlide === 2) {
          btn.classList.remove('active');
        }
      }
      
      if (targetSlide === currentSlide) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active dot indicators
    dotBtns.forEach((dot, idx) => {
      if (idx + 1 === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update active overlay visibility
    slideOverlays.forEach((overlay, idx) => {
      if (idx + 1 === currentSlide) {
        overlay.classList.add('active');
      } else {
        overlay.classList.remove('active');
      }
    });
  }

  // Navigation click routing
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const slideNum = parseInt(btn.getAttribute('data-slide'));
      goToSlide(slideNum);
      
      if (slideNum === 2) {
        navBtns.forEach(b => {
          if (b.getAttribute('data-slide') === '2') {
            b.classList.remove('active');
          }
        });
        btn.classList.add('active');
      }
    });
  });

  // Indicator Dot Click Routing
  dotBtns.forEach(dot => {
    dot.addEventListener('click', () => {
      const slideNum = parseInt(dot.getAttribute('data-slide'));
      goToSlide(slideNum);
    });
  });

  // Navigation Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let target = currentSlide - 1;
      if (target < 1) target = 3;
      goToSlide(target);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let target = currentSlide + 1;
      if (target > 3) target = 1;
      goToSlide(target);
    });
  }

  // Interactive Card Depth effects in Showcase
  const cards = document.querySelectorAll('.vintage-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (currentSlide === 1) {
        card.style.zIndex = '100';
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // Load More simulations
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreBtn.innerHTML = 'Loading Portfolio...';
      loadMoreBtn.disabled = true;
      
      setTimeout(() => {
        alert("Portfolio gallery loaded! In a production build, this would fetch additional fabrication archives.");
        loadMoreBtn.innerHTML = 'Load More';
        loadMoreBtn.disabled = false;
      }, 850);
    });
  }
}

/**
 * Contact Page Form Submission and validation (Self-detecting)
 */
function initContactForm() {
  const form = document.getElementById('inquiryForm');
  const toast = document.getElementById('toast');
  
  if (!form) return; // Exit if not on contact.html

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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const phonePattern = /^\+?[0-9\s-]{10,15}$/;
    if (!phonePattern.test(phone.replace(/\s+/g, ''))) {
      alert('Please enter a valid phone number (minimum 10 digits).');
      return;
    }

    // Submit Action (Simulation)
    const submitBtn = document.getElementById('submitInquiryBtn') || form.querySelector('button[type="submit"]');
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
      } else {
        alert('Thank you! Your inquiry was sent successfully.');
      }

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }, 1200);
  });
}

/**
 * Portfolio Filtering & Lightbox Modal (Self-detecting)
 */
function initPortfolio() {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return; // Exit if not on portfolio.html

  const items = Array.from(grid.querySelectorAll('.portfolio-item'));
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('lightbox');
  
  // 1. Grid Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 350);
        }
      });
    });
  });

  // 2. Lightbox Slideshow Modal
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let activeItems = [...items];
  let currentIndex = 0;

  // Open Lightbox
  items.forEach(item => {
    item.addEventListener('click', () => {
      const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
      activeItems = items.filter(i => activeFilter === 'all' || i.getAttribute('data-category') === activeFilter);
      
      currentIndex = activeItems.indexOf(item);
      updateLightboxContent();
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });
  });

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

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
  });

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
