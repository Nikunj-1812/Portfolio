// === 1. CURSOR ===
const cursor = document.getElementById('cursor-dot');
const isTouch = navigator.maxTouchPoints > 0 || window.matchMedia("(pointer: coarse)").matches;

if (isTouch) {
  if (cursor) cursor.style.display = 'none';
  document.body.style.cursor = 'auto';
} else {
  window.addEventListener('mousemove', (e) => {
    if (cursor) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    }
  });
}

// === 2. MAGNETIC BUTTONS ===
if (!isTouch) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${offsetX * 0.3}px, ${offsetY * 0.3}px)`;
      btn.style.transition = 'none';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
      btn.style.transition = 'transform 0.4s cubic-bezier(0.19,1,0.22,1)';
    });
  });
}

// === 3. CLICK SOUND ===
let soundEnabled = localStorage.getItem('ns_sound') !== 'off';
const clickAudio = new Audio('./assets/mixkit-cool-interface-click-tone-2568.wav');

function playClickSound() {
  if (!soundEnabled) return;
  try {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => console.log("Audio play failed:", e));
  } catch (e) {
    console.log("Audio not supported");
  }
}
// expose globally so other scripts (projects.js, blog.js) can call it
window.playClickSound = playClickSound;

document.addEventListener('click', () => {
  playClickSound();
});

const soundToggle = document.getElementById('sound-toggle');
if (soundToggle) {
  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    soundEnabled = !soundEnabled;
    localStorage.setItem('ns_sound', soundEnabled ? 'on' : 'off');
    updateSoundIcon();
    if(soundEnabled) playClickSound();
  });
}

function updateSoundIcon() {
  if (!soundToggle) return;
  soundToggle.innerHTML = soundEnabled ? '<i class="ti ti-volume"></i>' : '<i class="ti ti-volume-3"></i>';
}
updateSoundIcon();

document.addEventListener('dblclick', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('ns_sound', soundEnabled ? 'on' : 'off');
  updateSoundIcon();
  if(soundEnabled) playClickSound();
});

// === THEME TOGGLE ===
const themeToggle = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

function updateThemeIcon() {
  if (!themeToggle) return;
  themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon"></i>';
}
updateThemeIcon();

if (themeToggle) {
  themeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
    playClickSound();
  });
}



// === 5. GSAP ANIMATIONS ===
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  (() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Hero Load
      const heroExists = document.querySelector('.hero');
      if (heroExists) {
        gsap.to('.watermark-text', { opacity: 0.12, duration: 1.5, delay: 0.1 });
        
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        heroTl.fromTo('.hero-left > *', 
          { opacity: 0, y: 30 }, 
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 
          0.2
        )
        .fromTo('.hero-character-wrap', 
          { opacity: 0, scale: 0.9, x: 40 }, 
          { opacity: 1, scale: 1, x: 0, duration: 1.2, ease: 'power4.out' }, 
          0.4
        );
      } else {
        gsap.to('.watermark-text', { opacity: 0.12, duration: 1.5 });
      }

      // Scroll Reveals
      document.querySelectorAll('.reveal').forEach(el => {
        if(el.classList.contains('hero')) return;
        
        const cards = el.querySelectorAll('.project-card, .blog-card');
        if (cards.length > 0) {
          gsap.fromTo(cards, 
            { opacity: 0, y: 50 },
            { 
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
              scrollTrigger: { trigger: el, start: "top 85%" }
            }
          );
        }
        
        const textBlocks = el.querySelectorAll('h2, h3, p');
        if (textBlocks.length > 0) {
           gsap.fromTo(textBlocks, 
             { opacity: 0, y: 30 },
             { 
               opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
               scrollTrigger: { trigger: el, start: "top 85%" }
             }
           );
        }

        const images = el.querySelectorAll('img');
        if (images.length > 0) {
           gsap.fromTo(images, 
             { opacity: 0, scale: 0.9, y: 20 },
             { 
               opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'power3.out',
               scrollTrigger: { trigger: el, start: "top 85%" }
             }
           );
        }
      });

      // Section Headers
      document.querySelectorAll('.section-header-wrap').forEach(wrap => {
        if(wrap.closest('.hero')) return;
        const shLine = wrap.querySelector('.sh-line');
        const st = { trigger: wrap, start: "top 80%", once: true };
        
        if (shLine) gsap.fromTo(shLine, { width: 0, opacity: 0 }, { width: 60, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: st });
      });
    } else {
      gsap.set('.watermark-text', { opacity: 0.12 });
      gsap.set('.sh-line', { width: 60, opacity: 1 });
    }
  })();
}

// === 6. PAGE TRANSITIONS ===
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
    e.preventDefault();
    const targetUrl = link.href;
    
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.href = targetUrl;
      });
    } else {
      window.location.href = targetUrl;
    }
  }
});

// === 7. VANILLATILT ===
if (window.VanillaTilt) {
  VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    max: 7, speed: 400, glare: true, "max-glare": 0.06, scale: 1.02
  });
}

// === 8. SCROLL & NAVBAR ===
const scrollBar = document.getElementById('scroll-bar');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollBar) {
    scrollBar.style.width = `${(scrollY / docHeight) * 100}%`;
  }
  
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

// Back to Top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 300) {
      backToTop.style.opacity = '1';
      backToTop.style.pointerEvents = 'auto';
      backToTop.style.transform = 'translateY(0)';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.pointerEvents = 'none';
      backToTop.style.transform = 'translateY(20px)';
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Active Nav Indicator
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const navIndicator = document.createElement('div');
navIndicator.className = 'nav-indicator';
const navLinksContainer = document.querySelector('.nav-links');
if (navLinksContainer) navLinksContainer.appendChild(navIndicator);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
          navIndicator.style.width = `${link.offsetWidth}px`;
          navIndicator.style.left = `${link.offsetLeft}px`;
        }
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(sec => observer.observe(sec));

// Mobile Nav
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navOverlay = document.querySelector('.nav-overlay');
const navOverlayLinks = document.querySelectorAll('.nav-overlay a');

if (mobileMenuBtn && navOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    navOverlay.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navOverlay.classList.contains('active')) {
      icon.className = 'ti ti-x';
      document.body.style.overflow = 'hidden';
    } else {
      icon.className = 'ti ti-menu-2';
      document.body.style.overflow = '';
    }
  });

  navOverlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('active');
      mobileMenuBtn.querySelector('i').className = 'ti ti-menu-2';
      document.body.style.overflow = '';
    });
  });
}

// Github Grid Math.random
const contribGrid = document.querySelector('.contrib-grid');
if (contribGrid) {
  for (let i = 0; i < 52 * 7; i++) {
    const day = document.createElement('div');
    day.className = 'contrib-day';
    const isWeekday = i % 7 !== 0 && i % 7 !== 6;
    const probability = isWeekday ? 0.7 : 0.3;
    
    if (Math.random() < probability) {
      const level = Math.floor(Math.random() * 4) + 1;
      day.classList.add(`level-${level}`);
    } else {
      day.classList.add('level-0');
    }
    contribGrid.appendChild(day);
  }
}

// === 9. PORTFOLIO BOT ===
const botTrigger = document.getElementById('bot-trigger');
const botPanel = document.getElementById('bot-panel');
const botClose = document.getElementById('bot-close');
const botInput = document.getElementById('bot-input');
const botSend = document.getElementById('bot-send');
const botMessages = document.getElementById('bot-messages');

if (botTrigger && botPanel) {
  botTrigger.addEventListener('click', () => {
    botPanel.classList.toggle('active');
    if (botPanel.classList.contains('active')) botInput.focus();
  });

  botClose.addEventListener('click', () => {
    botPanel.classList.remove('active');
  });

  function addMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `bot-message ${isUser ? 'user' : 'bot'}`;
    msg.textContent = text;
    botMessages.appendChild(msg);
    botMessages.scrollTop = botMessages.scrollHeight;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'bot-message bot typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.id = 'bot-typing';
    botMessages.appendChild(typing);
    botMessages.scrollTop = botMessages.scrollHeight;
  }

  function removeTyping() {
    const typing = document.getElementById('bot-typing');
    if (typing) typing.remove();
  }

  function handleBotResponse(text) {
    const lower = text.toLowerCase();
    let response = "Great question! Try asking about skills, projects, or how to hire Nikunj 😄";
    
    if (lower.match(/skill|tech|stack/)) {
      response = "Nikunj works with React, Next.js, Node.js, Python, TensorFlow, PostgreSQL, Docker and more!";
    } else if (lower.match(/project|work|built/)) {
      response = "He's built DevFlow (SaaS), NeuralVision (AI API), and ShopSense (e-commerce). Check the Projects section!";
    } else if (lower.match(/hire|job|freelance|available/)) {
      response = "Yes! Nikunj is open to freelance projects and full-time roles. Reach him at nikunjsorathiya712@gmail.com";
    } else if (lower.match(/ai|ml|machine/)) {
      response = "Nikunj is deeply into AI/ML — he's trained CNNs, built NLP pipelines, and loves TensorFlow & FastAPI.";
    } else if (lower.match(/contact|email|reach/)) {
      response = "You can reach Nikunj at nikunjsorathiya712@gmail.com or via LinkedIn!";
    } else if (lower.match(/experience|year/)) {
      response = "Nikunj has 3+ years of coding experience and has deployed 5+ AI models.";
    }

    setTimeout(() => {
      removeTyping();
      addMessage(response);
    }, 900);
  }

  function sendMessage() {
    const text = botInput.value.trim();
    if (!text) return;
    
    addMessage(text, true);
    botInput.value = '';
    showTyping();
    handleBotResponse(text);
  }

  botSend.addEventListener('click', sendMessage);
  botInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  botInput.addEventListener('input', () => {
    playClickSound();
  });
}

// === 10. BOOKING MODAL ===
const bookCallBtn = document.getElementById('book-call-btn');
const bookingModal = document.getElementById('booking-modal');
const closeBookingBtns = document.querySelectorAll('.close-booking');
const steps = [
  document.getElementById('booking-step-1'),
  document.getElementById('booking-step-2'),
  document.getElementById('booking-step-3')
];

let selectedDate = '';
let selectedTime = '';
let selectedLocation = 'Google Meet';

if (bookCallBtn && bookingModal) {
  bookCallBtn.addEventListener('click', (e) => {
    e.preventDefault();
    bookingModal.classList.add('active');
    goToStep(0);
  });

  closeBookingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      bookingModal.classList.remove('active');
    });
  });

  // Step 1 Logic
  const bDate = document.getElementById('b-date');
  const bState = document.getElementById('b-state');
  const bLocation = document.getElementById('b-location');
  const timeSlots = document.querySelectorAll('.time-slot');
  const bNextBtn = document.getElementById('b-next-btn');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  if(bDate) bDate.min = today;

  function checkStep1() {
    if (selectedDate && selectedTime && bState && bState.value.trim() !== '') {
      bNextBtn.disabled = false;
    } else {
      bNextBtn.disabled = true;
    }
  }

  if (bState) {
    bState.addEventListener('input', checkStep1);
  }

  if (bDate) {
    bDate.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      checkStep1();
    });
  }

  if (bLocation) {
    bLocation.addEventListener('change', (e) => {
      selectedLocation = e.target.value;
    });
  }

  timeSlots.forEach(slot => {
    slot.addEventListener('click', (e) => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      e.target.classList.add('selected');
      selectedTime = e.target.textContent;
      checkStep1();
    });
  });

  if (bNextBtn) {
    bNextBtn.addEventListener('click', () => {
      const fullLocation = `${bState.value} - ${selectedLocation}`;
      document.getElementById('sum-date').textContent = selectedDate;
      document.getElementById('sum-time').textContent = selectedTime;
      document.getElementById('sum-loc').textContent = fullLocation;
      goToStep(1);
    });
  }

  // Step 2 Logic
  const bBackBtn = document.querySelector('.b-back-btn');
  const confirmBtn = document.getElementById('confirm-booking-btn');
  const bName = document.getElementById('b-name');
  const bEmail = document.getElementById('b-email');

  if (bBackBtn) {
    bBackBtn.addEventListener('click', () => {
      goToStep(0);
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (!bName.value || !bEmail.value) {
        alert("Please fill in your name and email.");
        return;
      }
      document.getElementById('success-name').textContent = bName.value;
      document.getElementById('success-email').textContent = bEmail.value;

      goToStep(2);
      
      // Reset form
      bName.value = '';
      bEmail.value = '';
      document.getElementById('b-notes').value = '';
      bDate.value = '';
      selectedDate = '';
      selectedTime = '';
      timeSlots.forEach(s => s.classList.remove('selected'));
      bNextBtn.disabled = true;
    });
  }

  function goToStep(index) {
    steps.forEach((step, i) => {
      if (step) {
        if (i === index) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      }
    });
  }
}
