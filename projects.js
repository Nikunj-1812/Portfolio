// === PROJECTS PAGE ===
(() => {
  const modal    = document.getElementById('project-modal');
  const backdrop = modal?.querySelector('.project-modal-backdrop');
  const closeBtn = modal?.querySelector('.project-modal-close');
  const cards    = document.querySelectorAll('.project-card[data-id]');

  if (!modal) return;

  // Devicon class map — icons will be styled with accent color via CSS
  const techIconMap = {
    'React':         'devicon-react-original',
    'React Native':  'devicon-react-original',
    'Next.js':       'devicon-nextjs-plain',
    'Node.js':       'devicon-nodejs-plain',
    'MongoDB':       'devicon-mongodb-plain',
    'PostgreSQL':    'devicon-postgresql-plain',
    'Python':        'devicon-python-plain',
    'FastAPI':       'devicon-fastapi-plain',
    'TensorFlow':    'devicon-tensorflow-original',
    'Docker':        'devicon-docker-plain',
    'TypeScript':    'devicon-typescript-plain',
    'Redis':         'devicon-redis-plain',
    'Tailwind':      'devicon-tailwindcss-plain',
    'Firebase':      'devicon-firebase-plain',
  };

  function openModal(card) {
    const title     = card.dataset.title;
    const tags      = card.dataset.tags.split(',');
    const img       = card.dataset.img;
    const longDesc  = card.dataset.long;
    const liveUrl   = card.dataset.live;
    const githubUrl = card.dataset.github;

    // Hero
    document.getElementById('pmd-img').src = img;
    document.getElementById('pmd-img').alt = title;
    document.getElementById('modal-title').textContent = title;

    // Tags
    document.getElementById('pmd-tags').innerHTML =
      tags.map(t => `<span class="pmd-tag">${t.trim()}</span>`).join('');

    // Description
    document.getElementById('pmd-long').textContent = longDesc;

    // Tech stack — accent-themed icons
    document.getElementById('pmd-tech').innerHTML = tags.map(t => {
      const name      = t.trim();
      const iconClass = techIconMap[name];
      if (iconClass) {
        return `<div class="pmd-tech-item">
          <i class="${iconClass}"></i>
          <span>${name}</span>
        </div>`;
      }
      // No devicon — pill badge
      return `<div class="pmd-tech-item pmd-tech-pill">
        <span>${name}</span>
      </div>`;
    }).join('');

    // CTAs
    document.getElementById('pmd-live').href   = liveUrl;
    document.getElementById('pmd-github').href = githubUrl;

    // Open
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.querySelector('.project-modal-scroll').scrollTop = 0;

    // Play sound
    if (window.playClickSound) window.playClickSound();

    if (window.gsap) {
      gsap.fromTo('.project-modal-panel',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    if (window.playClickSound) window.playClickSound();
  }

  // Click on card body opens modal
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModal(card));

    // "View Details" eye button inside card also opens modal
    const detailBtn = card.querySelector('.project-detail-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(card);
      });
    }
  });

  // Close handlers
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Back to top
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity       = window.scrollY > 400 ? '1' : '0';
      backToTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
    });
    backToTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }
})();
