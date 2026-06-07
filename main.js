/**
 * M.M. Engineering Works - Unified Single-Page Website JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sticky header scroll behavior
  initHeaderScroll();
  
  // Mobile menu toggle
  initMobileMenu();
  
  // Smooth scroll & scroll spy (IntersectionObserver)
  initScrollSpy();
  
  // Antigravity product grid interaction (hover depth & lightbox modal)
  initProductsGrid();
});

/**
 * Header scroll shadow & resizing
 */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/**
 * Mobile Navigation Toggle menu
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggleBtn');
  const navLinks = document.getElementById('navMenu');
  
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
    const links = navLinks.querySelectorAll('.nav-link, .nav-cta');
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }
}

/**
 * Smooth Scroll to section anchor links and ScrollSpy highlighting
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Smooth scroll click handler
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // If it's a hash anchor on the same page
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const headerHeight = document.getElementById('mainHeader').offsetHeight;
          const targetOffset = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetOffset,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // IntersectionObserver to highlight active link on scroll
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -60% 0px', // Triggers when section is in the middle of viewport
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${sectionId}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      observer.observe(section);
    });
  }
}

/**
 * Antigravity products grid card physics, lightbox slideshow, and "load more"
 */
function initProductsGrid() {
  const cards = document.querySelectorAll('.vintage-card');
  const lightbox = document.getElementById('lightbox');
  
  if (cards.length === 0) return;

  // 1. Z-Index depth adjustments on hover
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.zIndex = '100';
    });
    card.addEventListener('mouseleave', () => {
      card.style.zIndex = '';
    });
  });

  // 3. Lightbox slideshow for cards
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    // Filter cards to exclude the proprietor profile card from slideshow
    const slideshowCards = Array.from(cards).filter(card => !card.classList.contains('person-card'));
    let currentIndex = 0;

    // Click on product card opens lightbox
    slideshowCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        currentIndex = idx;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
      });
    });

    function updateLightboxContent() {
      const activeCard = slideshowCards[currentIndex];
      if (!activeCard) return;

      const img = activeCard.querySelector('img');
      const captionText = activeCard.querySelector('.photo-caption').textContent;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.innerHTML = `<strong>${captionText}</strong> &mdash; M.M. Engineering Works Project`;
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Restore scroll
    }

    function navigateLightbox(direction) {
      currentIndex += direction;
      if (currentIndex >= slideshowCards.length) {
        currentIndex = 0;
      } else if (currentIndex < 0) {
        currentIndex = slideshowCards.length - 1;
      }
      updateLightboxContent();
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

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

    // Keyboard bindings
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
      }
    });
  }
}


