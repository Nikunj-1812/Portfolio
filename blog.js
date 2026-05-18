// === BLOG LOGIC ===
(() => {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const blogCards = document.querySelectorAll('.blog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      blogCards.forEach(card => {
        if (category === 'All' || card.getAttribute('data-category') === category) {
          card.style.display = 'block';
          if(window.gsap) {
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.style.opacity = '1';
        backToTop.style.pointerEvents = 'auto';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.pointerEvents = 'none';
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
