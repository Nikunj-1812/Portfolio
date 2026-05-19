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

// GitHub contribution graph and live stats
const contribGrid = document.querySelector('.contrib-grid');
const githubSection = document.getElementById('github');
if (contribGrid && githubSection) {
  const githubUser = githubSection.dataset.githubUser || 'Nikunj-1812';
  const statusEl = document.getElementById('github-status');
  const statEls = {
    contributions: document.querySelector('[data-github-stat="contributions"]'),
    repos: document.querySelector('[data-github-stat="repos"]'),
    stars: document.querySelector('[data-github-stat="stars"]'),
    prs: document.querySelector('[data-github-stat="prs"]'),
  };

  const setStat = (key, value) => {
    if (statEls[key]) statEls[key].textContent = Number.isFinite(value) ? value.toLocaleString() : '--';
  };

  const apiHeaders = { 'Accept': 'application/vnd.github+json' };
  const profileUrl = `https://api.github.com/users/${encodeURIComponent(githubUser)}`;
  const reposUrl = `https://api.github.com/users/${encodeURIComponent(githubUser)}/repos?per_page=100&sort=updated`;
  const contribUrl = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(githubUser)}`;
  const prsUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(`type:pr author:${githubUser} is:public`)}`;

  const fallbackStats = { contributions: 44, repos: 13, stars: 0, prs: 0 };

  const loadJson = async (url) => {
    const response = await fetch(url, { headers: apiHeaders });
    if (!response.ok) throw new Error(`Request failed: ${url}`);
    return response.json();
  };

  Promise.allSettled([
    loadJson(profileUrl),
    loadJson(reposUrl),
    loadJson(contribUrl),
    loadJson(prsUrl),
  ]).then(results => {
    const profile = results[0].status === 'fulfilled' ? results[0].value : null;
    const repos = results[1].status === 'fulfilled' && Array.isArray(results[1].value) ? results[1].value : [];
    const contributionData = results[2].status === 'fulfilled' ? results[2].value : null;
    const prsData = results[3].status === 'fulfilled' ? results[3].value : null;

    const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const currentYear = new Date().getFullYear();
    const contributions = Number(contributionData?.total?.[currentYear] ?? Object.values(contributionData?.total || {}).slice(-1)[0] ?? fallbackStats.contributions);
    const repoCount = Number.isFinite(profile?.public_repos) ? profile.public_repos : (repos.length || fallbackStats.repos);
    const prCount = Number.isFinite(prsData?.total_count) ? prsData.total_count : fallbackStats.prs;

    const contributionDays = Array.isArray(contributionData?.contributions) ? contributionData.contributions : [];
    if (contributionDays.length) {
      const firstDate = contributionDays[0]?.date ? new Date(`${contributionDays[0].date}T00:00:00`) : null;
      const leadingEmptyDays = firstDate ? firstDate.getDay() : 0;
      const trailingEmptyDays = (7 - ((leadingEmptyDays + contributionDays.length) % 7)) % 7;
      const cells = [];

      for (let i = 0; i < leadingEmptyDays; i++) {
        cells.push('<div class="contrib-day empty" aria-hidden="true"></div>');
      }

      contributionDays.forEach(day => {
        cells.push(`<div class="contrib-day level-${day.level}" title="${day.date}: ${day.count} contributions" aria-label="${day.date}: ${day.count} contributions"></div>`);
      });

      for (let i = 0; i < trailingEmptyDays; i++) {
        cells.push('<div class="contrib-day empty" aria-hidden="true"></div>');
      }

      contribGrid.innerHTML = cells.join('');
      if (statusEl) {
        statusEl.textContent = `Live GitHub data for @${githubUser}`;
      }
    } else {
      contribGrid.innerHTML = `
        <div class="github-fallback">
          <span>GitHub activity could not be loaded right now.</span>
          <a href="https://github.com/${encodeURIComponent(githubUser)}" target="_blank" rel="noopener noreferrer">View the profile on GitHub</a>
        </div>
      `;
      if (statusEl) {
        statusEl.textContent = `Showing cached GitHub totals for @${githubUser}`;
      }
    }

    setStat('contributions', contributions);
    setStat('repos', repoCount);
    setStat('stars', stars);
    setStat('prs', prCount);
  }).catch(() => {
    contribGrid.innerHTML = `
      <div class="github-fallback">
        <span>GitHub activity could not be loaded right now.</span>
        <a href="https://github.com/${encodeURIComponent(githubUser)}" target="_blank" rel="noopener noreferrer">View the profile on GitHub</a>
      </div>
    `;

    setStat('contributions', fallbackStats.contributions);
    setStat('repos', fallbackStats.repos);
    setStat('stars', fallbackStats.stars);
    setStat('prs', fallbackStats.prs);

    if (statusEl) {
      statusEl.textContent = `Showing cached GitHub totals for @${githubUser}`;
    }
  });
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
    const q = text.toLowerCase().trim();

    // ── Knowledge base ──────────────────────────────────────────────
    const kb = [

      // Greetings
      {
        match: /^(hi|hello|hey|sup|yo|good\s*(morning|afternoon|evening)|howdy|hiya|what'?s up)/,
        ans: "Hey there! 👋 I'm Nikunj's portfolio bot. Ask me anything — his skills, projects, experience, availability, or how to get in touch!"
      },
      {
        match: /how are you|how r u|how do you do/,
        ans: "I'm doing great, thanks for asking! 😄 I'm here to tell you everything about Nikunj. What would you like to know?"
      },
      {
        match: /who are you|what are you|introduce yourself|tell me about yourself/,
        ans: "I'm the Portfolio Bot for Nikunj Sorathiya — a Full Stack Developer & AI/ML enthusiast. I can answer questions about his skills, projects, experience, education, and availability. Ask away! 🤖"
      },

      // About Nikunj
      {
        match: /who is nikunj|about nikunj|tell me about nikunj|nikunj sorathiya/,
        ans: "Nikunj Sorathiya is a Full Stack Developer and AI/ML enthusiast from India 🇮🇳. He builds production-grade web apps with React, Next.js & Node.js, and loves integrating AI into real-world products. He has 3+ years of coding experience and has deployed 5+ AI models."
      },
      {
        match: /where.*from|location|city|country|india|gujarat/,
        ans: "Nikunj is from India 🇮🇳. He works remotely and is open to opportunities worldwide."
      },
      {
        match: /age|how old|born/,
        ans: "Nikunj is a young developer in his early 20s, already building production-grade apps and AI systems. Age is just a number when the code ships! 🚀"
      },
      {
        match: /education|degree|college|university|study|student/,
        ans: "Nikunj is pursuing his degree in Computer Science/IT while simultaneously building real-world projects and contributing to open source. He believes in learning by doing."
      },
      {
        match: /hobby|interest|free time|passion|outside.*work|when not coding/,
        ans: "When Nikunj isn't coding, he's reading ML research papers, contributing to open source, exploring new AI tools, or experimenting with side projects. He's genuinely passionate about tech — it's not just a job for him. 📚"
      },
      {
        match: /language.*speak|speak.*language|english|hindi|gujarati/,
        ans: "Nikunj is fluent in English, Hindi, and Gujarati. He communicates clearly and professionally in English for all work-related interactions."
      },

      // Skills & Tech Stack
      {
        match: /skill|tech.*stack|stack|technolog|what.*know|what.*use|tools/,
        ans: "Nikunj's tech stack:\n\n🌐 Frontend: React, Next.js, TypeScript, Tailwind CSS\n⚙️ Backend: Node.js, Express, FastAPI, Python\n🗄️ Databases: MongoDB, PostgreSQL, Redis\n🤖 AI/ML: TensorFlow, PyTorch, OpenAI API, scikit-learn\n🐳 DevOps: Docker, GitHub Actions, Vercel, AWS\n🎨 Design: Figma"
      },
      {
        match: /frontend|front.?end|react|next\.?js|typescript|tailwind|css|html/,
        ans: "On the frontend, Nikunj is highly proficient in React (hooks, context, performance optimization), Next.js 14 (App Router, SSR, SSG), TypeScript, and Tailwind CSS. He builds pixel-perfect, accessible, and performant UIs."
      },
      {
        match: /backend|back.?end|node|express|api|server|rest|graphql/,
        ans: "For backend, Nikunj works with Node.js + Express for REST APIs, FastAPI (Python) for high-performance async services, and has experience with GraphQL. He follows clean architecture and writes well-documented APIs."
      },
      {
        match: /database|db|mongo|postgresql|postgres|sql|redis|nosql/,
        ans: "Nikunj is comfortable with both SQL (PostgreSQL with Prisma ORM) and NoSQL (MongoDB). He also uses Redis for caching and session management. He designs efficient schemas and writes optimized queries."
      },
      {
        match: /ai|ml|machine learning|deep learning|neural|tensorflow|pytorch|model|nlp|computer vision/,
        ans: "AI/ML is Nikunj's passion! 🤖 He has:\n• Trained custom CNNs for image classification (94% accuracy)\n• Built NLP pipelines for text analysis\n• Integrated OpenAI GPT API into production apps\n• Deployed 5+ AI models to production\n• Worked with TensorFlow, PyTorch, and scikit-learn"
      },
      {
        match: /docker|devops|ci.?cd|github actions|deploy|cloud|aws|vercel|hosting/,
        ans: "Nikunj containerizes apps with Docker, automates deployments with GitHub Actions CI/CD pipelines, and deploys to Vercel, AWS, and other cloud platforms. He follows zero-downtime deployment practices."
      },
      {
        match: /figma|design|ui|ux|prototype/,
        ans: "Nikunj uses Figma for UI/UX design and prototyping. He bridges the gap between design and development, ensuring pixel-perfect implementation of designs."
      },
      {
        match: /python/,
        ans: "Python is Nikunj's go-to language for AI/ML work. He uses it for building FastAPI backends, training ML models with TensorFlow/PyTorch, data processing with pandas/numpy, and scripting automation tasks."
      },
      {
        match: /git|github|version control|open source|contribution/,
        ans: "Nikunj's live GitHub profile currently shows 44 contributions this year, 13 public repositories, and 0 public stars and pull requests on the profile snapshot used by this portfolio. He follows Git best practices — feature branches, meaningful commits, and code reviews. Check his GitHub: github.com/Nikunj-1812"
      },

      // Projects
      {
        match: /project|built|portfolio|work|what.*made|show.*work/,
        ans: "Nikunj has built some impressive projects:\n\n🔷 DevFlow — Real-time SaaS project management (React, Node.js, MongoDB, Socket.io)\n🔷 NeuralVision — AI image classification API (Python, FastAPI, TensorFlow, Docker)\n🔷 ShopSense — E-commerce with AI recommendations (Next.js, PostgreSQL, Stripe)\n🔷 ChatBase — AI chatbot builder (React, OpenAI, Node.js, Redis)\n🔷 CodeSynth — AI code generator (TypeScript, Next.js, OpenAI)\n🔷 Trackify — Fitness tracking app (React Native, Node.js, MongoDB)\n\nVisit the Projects page for full details!"
      },
      {
        match: /devflow|project management|saas|kanban/,
        ans: "DevFlow is a real-time SaaS project management tool. It features drag-and-drop Kanban boards powered by Socket.io, team workspaces with role-based access, Slack webhook integration, and a rich activity feed. Built with React, Node.js, Express, and MongoDB."
      },
      {
        match: /neuralvision|image.*classif|cnn|object.*detect/,
        ans: "NeuralVision is a production-ready AI API for real-time image classification and object detection. It uses a custom CNN trained with TensorFlow (94% accuracy), served via FastAPI, containerized with Docker, and includes API key auth + rate limiting."
      },
      {
        match: /shopsense|e.?commerce|shop|stripe|payment/,
        ans: "ShopSense is a full-stack e-commerce platform built with Next.js 14 App Router. It features Stripe payments, AI-powered product recommendations, real-time inventory management, order tracking, and an admin dashboard. Uses PostgreSQL + Prisma ORM."
      },
      {
        match: /chatbase|chatbot|gpt|openai|ai.*chat/,
        ans: "ChatBase is an AI chatbot builder that lets businesses embed a trained assistant on their website. It uses OpenAI's GPT API, features a drag-and-drop widget customizer, conversation analytics, multi-language support, and a REST API. Built with React + Node.js + Redis."
      },
      {
        match: /codesynth|code.*generat|ai.*code/,
        ans: "CodeSynth is an AI-powered code generation tool that converts plain English into production-ready code. It supports 20+ languages, has a built-in Monaco editor, syntax highlighting, and uses streaming OpenAI API responses for a real-time typing effect. Built with Next.js + TypeScript."
      },
      {
        match: /trackify|fitness|gps|workout|mobile.*app|react native/,
        ans: "Trackify is a cross-platform fitness app built with React Native. It records GPS routes in real-time, visualizes workout data with interactive charts, supports social challenges, and sends push notifications via Firebase Cloud Messaging. Available on iOS and Android."
      },

      // Experience & Background
      {
        match: /experience|how long|years.*coding|coding.*years|background|career/,
        ans: "Nikunj has 3+ years of hands-on coding experience. He started with web fundamentals, progressed to full-stack development, and has been deeply involved in AI/ML for the past 2 years. He's built 20+ projects ranging from SaaS apps to AI APIs."
      },
      {
        match: /internship|intern|work.*experience|job.*history|previous.*work/,
        ans: "Nikunj has worked on real-world projects and freelance engagements, building production applications for clients. He's also an active open source contributor. He's currently open to full-time roles and freelance projects."
      },
      {
        match: /achievement|award|accomplishment|proud/,
        ans: "Some of Nikunj's achievements:\n🏆 Deployed 5+ AI models to production\n🏆 Built 20+ projects across web and mobile\n🏆 44 GitHub contributions this year\n🏆 13 public repositories\n🏆 Active open source contributor on GitHub"
      },

      // Availability & Hiring
      {
        match: /hire|hiring|available|availability|open.*to|looking.*for|job|full.?time|part.?time|freelance|contract|opportunity|work.*with/,
        ans: "Yes! Nikunj is currently open to:\n✅ Full-time developer roles\n✅ Freelance & contract projects\n✅ AI/ML collaborations\n✅ Open source partnerships\n✅ Remote work (worldwide)\n\nReach him at nikunjsorathiya712@gmail.com or book a free call from the Contact section!"
      },
      {
        match: /rate|salary|charge|cost|price|budget|how much/,
        ans: "Nikunj's rates depend on the project scope, timeline, and complexity. The best way to discuss this is to book a free discovery call — he'll give you a clear quote after understanding your requirements. Use the 'Book Free Call' button in the Contact section!"
      },
      {
        match: /remote|on.?site|relocat|work.*from.*home|wfh/,
        ans: "Nikunj works fully remotely and is comfortable with async communication across time zones. He's open to occasional on-site visits for the right opportunity."
      },
      {
        match: /timeline|deadline|how.*long|turnaround|delivery/,
        ans: "Project timelines depend on scope and complexity. A simple landing page might take 1-2 weeks, while a full-stack SaaS app could take 2-3 months. Book a free call to discuss your specific project timeline!"
      },

      // Contact
      {
        match: /contact|reach|email|message|get.*touch|talk|connect|dm/,
        ans: "You can reach Nikunj through multiple channels:\n📧 Email: nikunjsorathiya712@gmail.com\n💼 LinkedIn: linkedin.com/in/nikunj-sorathiya-6b7098382\n🐙 GitHub: github.com/Nikunj-1812\n🐦 X (Twitter): x.com/Nikunj_1812_\n📞 Or book a free call from the Contact section!"
      },
      {
        match: /linkedin/,
        ans: "Connect with Nikunj on LinkedIn: linkedin.com/in/nikunj-sorathiya-6b7098382 — he's active there and responds quickly to messages!"
      },
      {
        match: /github/,
        ans: "Check out Nikunj's GitHub: github.com/Nikunj-1812 — 44 contributions this year and 13 public repositories on the current profile snapshot. You'll find all his open source work there!"
      },
      {
        match: /twitter|x\.com|tweet/,
        ans: "Follow Nikunj on X (Twitter): x.com/Nikunj_1812_ — he shares dev tips, AI insights, and project updates."
      },
      {
        match: /book.*call|schedule|meeting|call|consultation|discovery/,
        ans: "You can book a free 30-minute discovery call with Nikunj directly from this portfolio! Just click the 'Book Free Call' button in the Contact section. He's available on Google Meet, Zoom, or phone call. 📞"
      },
      {
        match: /response.*time|reply.*fast|how.*soon|when.*reply/,
        ans: "Nikunj typically responds to emails and LinkedIn messages within 24 hours. For urgent inquiries, booking a call is the fastest way to connect!"
      },

      // Portfolio & Website
      {
        match: /portfolio|website|this.*site|built.*this|how.*made.*this/,
        ans: "This portfolio is built with pure HTML, CSS, and vanilla JavaScript — no frameworks! It features GSAP animations, ScrollTrigger, VanillaTilt 3D effects, a custom cursor, theme switching, click sounds, and this AI bot. All hand-crafted by Nikunj. 🎨"
      },
      {
        match: /blog|article|writing|post|read/,
        ans: "Nikunj writes about web development and AI/ML on his blog. Topics include React Server Components, building image classifiers with TensorFlow.js, Docker + GitHub Actions deployment setups, and more. Check the Blog section!"
      },

      // Fun / Personality
      {
        match: /fun fact|interesting|surprise|cool.*fact/,
        ans: "Fun fact: Nikunj reads ML research papers for fun! 🤓 He also built this entire portfolio from scratch without any CSS frameworks — pure CSS with custom animations. He's the kind of developer who obsesses over the details."
      },
      {
        match: /favorite|favourite|prefer|best.*language|love.*code/,
        ans: "Nikunj's favourite stack is Next.js + TypeScript on the frontend and FastAPI + Python for AI services. His favourite language overall is TypeScript — he loves the type safety and developer experience. For AI work, Python is king! 🐍"
      },
      {
        match: /strength|good at|best.*at|expert|speciali/,
        ans: "Nikunj's core strengths:\n💪 Building scalable full-stack web applications\n💪 Integrating AI/ML into real products\n💪 Clean, maintainable code architecture\n💪 Fast delivery without sacrificing quality\n💪 Bridging the gap between design and development"
      },
      {
        match: /weakness|improve|learning|currently.*learn|studying/,
        ans: "Nikunj is currently deepening his knowledge in LLM fine-tuning, advanced system design, and Kubernetes for container orchestration. He believes in continuous learning and always has something new on his reading list. 📖"
      },

      // Collaboration
      {
        match: /team|collaborat|work.*with.*team|team.*player|agile|scrum/,
        ans: "Nikunj is a strong team player. He's comfortable working in Agile/Scrum environments, doing code reviews, pair programming, and async collaboration using tools like Slack, Notion, Linear, and GitHub. He communicates proactively and ships on time."
      },
      {
        match: /startup|agency|company|corporate|enterprise/,
        ans: "Nikunj has experience working on both startup-style fast-paced projects and more structured enterprise-level applications. He adapts quickly to different team cultures and workflows."
      },

      // Fallback suggestions
      {
        match: /help|what.*ask|what.*can.*do|options|menu|guide/,
        ans: "Here's what you can ask me about:\n\n👤 About Nikunj\n🛠️ Skills & Tech Stack\n🚀 Projects\n💼 Experience & Background\n📅 Availability & Hiring\n📧 Contact Info\n💰 Rates & Timeline\n🌐 This Portfolio\n\nJust type your question naturally!"
      },
    ];
    // ── End knowledge base ──────────────────────────────────────────

    // Find best match
    let response = null;
    for (const entry of kb) {
      if (entry.match.test(q)) {
        response = entry.ans;
        break;
      }
    }

    // Fallback
    if (!response) {
      const fallbacks = [
        "Hmm, I'm not sure about that one! Try asking about Nikunj's skills, projects, experience, or how to hire him. 😊",
        "I don't have an answer for that yet! You can always reach Nikunj directly at nikunjsorathiya712@gmail.com for specific questions.",
        "That's outside my knowledge base! Try asking about tech stack, projects, availability, or contact info. Or just email Nikunj directly — he's super responsive! 📧",
      ];
      response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    const delay = 600 + Math.random() * 500; // 600–1100ms feels natural
    setTimeout(() => {
      removeTyping();
      addMessage(response);
    }, delay);
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
