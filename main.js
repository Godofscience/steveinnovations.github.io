document.addEventListener("DOMContentLoaded", () => {
  // Initialize Icons
  lucide.createIcons();

  // Showcase Carousel Controls
  const track = document.getElementById('showcase-track');
  const scrollLeftBtn = document.getElementById('scroll-left');
  const scrollRightBtn = document.getElementById('scroll-right');

  if (scrollLeftBtn && track) {
    scrollLeftBtn.addEventListener('click', () => track.scrollBy({ left: -350, behavior: 'smooth' }));
  }
  
  if (scrollRightBtn && track) {
    scrollRightBtn.addEventListener('click', () => track.scrollBy({ left: 350, behavior: 'smooth' }));
  }
});