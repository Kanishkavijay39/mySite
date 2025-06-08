export default function decorate(block) {
  const slides = [...block.children];
  
  // Create carousel structure
  const carousel = document.createElement('div');
  carousel.className = 'carousel-container';
  
  // Process each slide
  slides.forEach((slide, index) => {
    const slideElement = document.createElement('div');
    slideElement.className = 'carousel-slide';
    
    // Extract content from table cells
    const cells = [...slide.children];
    
    // Assuming structure: Title | Image | Description | Link
    const title = cells[0]?.textContent || '';
    const imageCell = cells[1];
    const description = cells[2]?.textContent || '';
    const linkCell = cells[3];
    
    // Create slide content
    const content = document.createElement('div');
    content.className = 'carousel-content';
    
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title;
      content.appendChild(h2);
    }
    
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      content.appendChild(p);
    }
    
    if (linkCell && linkCell.querySelector('a')) {
      const link = linkCell.querySelector('a').cloneNode(true);
      content.appendChild(link);
    }
    
    // Add image if exists
    if (imageCell && imageCell.querySelector('img')) {
      const img = imageCell.querySelector('img').cloneNode(true);
      slideElement.appendChild(img);
    }
    
    slideElement.appendChild(content);
    carousel.appendChild(slideElement);
  });
  
  // Clear original content and add carousel
  block.innerHTML = '';
  block.appendChild(carousel);
  
  // Add navigation controls
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-nav carousel-prev';
  prevBtn.innerHTML = '❮';
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-nav carousel-next';
  nextBtn.innerHTML = '❯';
  
  block.appendChild(prevBtn);
  block.appendChild(nextBtn);
  
  // Add indicators
  const indicators = document.createElement('div');
  indicators.className = 'carousel-indicators';
  
  slides.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
    indicator.addEventListener('click', () => goToSlide(index));
    indicators.appendChild(indicator);
  });
  
  block.appendChild(indicators);
  
  // Carousel functionality
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  function updateCarousel() {
    const translateX = -currentSlide * 100;
    carousel.style.transform = `translateX(${translateX}%)`;
    
    // Update indicators
    indicators.querySelectorAll('.carousel-indicator').forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
    });
  }
  
  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }
  
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }
  
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Auto-play (optional)
  let autoPlayInterval = setInterval(nextSlide, 5000);
  
  // Pause auto-play on hover
  block.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });
  
  block.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(nextSlide, 5000);
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });
  
  // Touch/swipe support for mobile
  let startX = null;
  
  block.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });
  
  block.addEventListener('touchend', (e) => {
    if (!startX) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    startX = null;
  });
} 