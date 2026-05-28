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

  // Custom cursor growth on hover (delegated to support dynamic elements)
  document.body.addEventListener('mouseover', (e) => {
    const target = e.target.closest('.interactive, a, button, input, select, textarea, .project-card, .blog-card, .time-slot, .filter-pill, .social-btn, [role="button"]');
    if (target && cursor) {
      cursor.classList.add('cursor-grow');
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    const target = e.target.closest('.interactive, a, button, input, select, textarea, .project-card, .blog-card, .time-slot, .filter-pill, .social-btn, [role="button"]');
    if (target && cursor) {
      const related = e.relatedTarget ? e.relatedTarget.closest('.interactive, a, button, input, select, textarea, .project-card, .blog-card, .time-slot, .filter-pill, .social-btn, [role="button"]') : null;
      if (related !== target) {
        cursor.classList.remove('cursor-grow');
      }
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
    clickAudio.play().catch(() => {});
  } catch (e) {
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

// === BLOG OPENING TOAST ===
function showBlogOpeningToast() {
  let toast = document.getElementById('blog-opening-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'blog-opening-toast';
    toast.className = 'blog-opening-toast';
    toast.textContent = 'Blog is opening...';
    document.body.appendChild(toast);
  }

  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');

  clearTimeout(window.__blogOpeningToastTimer);
  window.__blogOpeningToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 1200);
}

window.showBlogOpeningToast = showBlogOpeningToast;



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
    const href = link.getAttribute('href') || '';
    if (href.includes('blog.html') || href.includes('blog2.html')) {
      e.preventDefault();
      showBlogOpeningToast();
      playClickSound();
      setTimeout(() => {
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            window.location.href = link.href;
          });
        } else {
          window.location.href = link.href;
        }
      }, 550);
      return;
    }

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
    navbar.classList.toggle('scrolled', scrollY > 50);
  }
});

// Back to Top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    const show = window.scrollY >= 300;
    backToTop.style.opacity = show ? '1' : '0';
    backToTop.style.pointerEvents = show ? 'auto' : 'none';
    backToTop.style.transform = show ? 'translateY(0)' : 'translateY(20px)';
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// === ACTIVE NAV INDICATOR ===
const navLinksContainer = document.querySelector('.nav-links');
const navIndicator = document.createElement('div');
navIndicator.className = 'nav-indicator';
if (navLinksContainer) navLinksContainer.appendChild(navIndicator);

function setActiveNavLink(link) {
  document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
  if (!link) return;
  link.classList.add('active');
  // slide the pill indicator
  navIndicator.style.width  = link.offsetWidth + 'px';
  navIndicator.style.left   = link.offsetLeft + 'px';
  navIndicator.style.opacity = '1';
}

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
const isIndexPage = currentPath === 'index.html' || currentPath === '';

if (isIndexPage) {
  // Scroll-spy: watch all sections, fire when they cross the middle of the viewport
  function runScrollSpy() {
    const allSections = document.querySelectorAll('section[id]');
    if (!allSections.length) return;

    const navLinkEls = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
      // pick the entry that is intersecting AND closest to top
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (!visible.length) return;
      const id = visible[0].target.id;

      const match = [...navLinkEls].find(l => {
        const href = l.getAttribute('href') || '';
        // match  "#home"  OR  "index.html#home"
        return href.endsWith(`#${id}`);
      });
      if (match) setActiveNavLink(match);
    }, {
      threshold: 0,
      rootMargin: '-40% 0px -55% 0px'   // fires when section centre crosses viewport centre
    });

    allSections.forEach(sec => observer.observe(sec));

    // Set initial active on page load (no scroll yet)
    const homeLink = [...navLinkEls].find(l => (l.getAttribute('href') || '').endsWith('#home'));
    if (homeLink) requestAnimationFrame(() => setActiveNavLink(homeLink));
  }

  // Sections may be injected by loadComponents — wait for them
  if (document.querySelectorAll('section[id]').length >= 2) {
    runScrollSpy();
  } else {
    // Poll until dynamic sections are in the DOM
    const waitForSections = setInterval(() => {
      if (document.querySelectorAll('section[id]').length >= 2) {
        clearInterval(waitForSections);
        runScrollSpy();
      }
    }, 100);
  }

} else {
  // Non-index pages: highlight by filename
  const navLinkEls = document.querySelectorAll('.nav-links a');
  const match = [...navLinkEls].find(l => {
    const href = (l.getAttribute('href') || '').split('#')[0].split('/').pop();
    return href === currentPath;
  });
  if (match) requestAnimationFrame(() => setActiveNavLink(match));
}

// Mobile Nav


// Mobile Nav
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navOverlay = document.querySelector('.nav-overlay');
const navBackdrop = document.querySelector('.nav-backdrop');
const navOverlayLinks = document.querySelectorAll('.nav-overlay a');

function closeMobileNav() {
  navOverlay.classList.remove('active');
  if (navBackdrop) navBackdrop.classList.remove('active');
  mobileMenuBtn.querySelector('i').className = 'ti ti-menu-2';
  document.body.style.overflow = '';
}

if (mobileMenuBtn && navOverlay) {
  mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navOverlay.classList.toggle('active');
    if (navBackdrop) navBackdrop.classList.toggle('active', isOpen);
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = isOpen ? 'ti ti-x' : 'ti ti-menu-2';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on backdrop click
  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

  navOverlayLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
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

    // Render a filtered set of days for a specific year
    function renderYear(year) {
      const daysForYear = contributionDays.filter(d => d.date && d.date.startsWith(`${year}-`));
      if (!daysForYear.length) {
        contribGrid.innerHTML = '<div class="github-fallback">No contribution data for this year.</div>';
        return;
      }

      // Sort by date ascending to preserve weekly layout
      daysForYear.sort((a,b) => new Date(a.date) - new Date(b.date));

      const firstDate = daysForYear[0] ? new Date(`${daysForYear[0].date}T00:00:00`) : null;
      const leadingEmptyDays = firstDate ? firstDate.getDay() : 0;
      const trailingEmptyDays = (7 - ((leadingEmptyDays + daysForYear.length) % 7)) % 7;
      const cells = [];

      for (let i = 0; i < leadingEmptyDays; i++) cells.push('<div class="contrib-day empty" aria-hidden="true"></div>');

      daysForYear.forEach(day => {
        cells.push(`<div class="contrib-day level-${day.level}" title="${day.date}: ${day.count} contributions" aria-label="${day.date}: ${day.count} contributions"></div>`);
      });

      for (let i = 0; i < trailingEmptyDays; i++) cells.push('<div class="contrib-day empty" aria-hidden="true"></div>');

      contribGrid.innerHTML = cells.join('');
      const dotEl = document.getElementById('github-online-dot');
      if (dotEl) dotEl.setAttribute('data-tooltip', `Live · @${githubUser}`);
      // update the contribution stat to the selected year total if available
      const yearTotal = contributionData?.total?.[year] ?? null;
      if (yearTotal !== null && yearTotal !== undefined) setStat('contributions', Number(yearTotal));
    }

    // Populate year selector (if present) and initialize
    const yearSelect = document.getElementById('contrib-year-select');
    const availableYears = contributionData && contributionData.total ? Object.keys(contributionData.total).map(y => Number(y)).sort((a,b) => b - a) : [new Date().getFullYear()];
    if (yearSelect) {
      yearSelect.innerHTML = availableYears.map(y => `<option value="${y}">${y}</option>`).join('');
      yearSelect.addEventListener('change', (e) => {
        renderYear(Number(e.target.value));
      });
    }

    if (contributionDays.length) {
      const initYear = availableYears[0] || new Date().getFullYear();
      if (yearSelect) yearSelect.value = initYear;
      renderYear(initYear);
    } else {
      contribGrid.innerHTML = `
        <div class="github-fallback">
          <span>GitHub activity could not be loaded right now.</span>
          <a href="https://github.com/${encodeURIComponent(githubUser)}" target="_blank" rel="noopener noreferrer">View the profile on GitHub</a>
        </div>
      `;
      const dotEl2 = document.getElementById('github-online-dot');
      if (dotEl2) dotEl2.setAttribute('data-tooltip', `Active on GitHub`);
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

    const dotElFallback = document.getElementById('github-online-dot');
    if (dotElFallback) dotElFallback.setAttribute('data-tooltip', `Active on GitHub`);
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

  const BOT_MEMORY_KEY = 'ns_portfolio_bot_memory_v2';
  const BOT_MAX_HISTORY = 8;
  const fallbackBotMemory = {
    name: '',
    topics: [],
    lastTopic: '',
    lastIntent: '',
    history: [],
  };

  function loadBotMemory() {
    try {
      const stored = localStorage.getItem(BOT_MEMORY_KEY);
      if (!stored) return { ...fallbackBotMemory };
      const parsed = JSON.parse(stored);
      return {
        ...fallbackBotMemory,
        ...parsed,
        topics: Array.isArray(parsed.topics) ? parsed.topics.slice(0, 10) : [],
        history: Array.isArray(parsed.history) ? parsed.history.slice(-BOT_MAX_HISTORY) : [],
      };
    } catch {
      return { ...fallbackBotMemory };
    }
  }

  function saveBotMemory(nextMemory) {
    try {
      localStorage.setItem(BOT_MEMORY_KEY, JSON.stringify(nextMemory));
    } catch {
      // Ignore storage failures (private mode / quota limits).
    }
  }

  let botMemory = loadBotMemory();

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9\s+.-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function cleanDisplayName(value) {
    return String(value || '')
      .replace(/\b(i am|i'm|im|call me|my name is|this is)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\.$/, '');
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function rememberTopic(topic) {
    if (!topic) return;
    botMemory.lastTopic = topic;
    if (!botMemory.topics.includes(topic)) {
      botMemory.topics = [topic, ...botMemory.topics].slice(0, 5);
    }
    saveBotMemory(botMemory);
  }

  function rememberHistory(role, text, intent) {
    botMemory.history.push({ role, text, intent, at: Date.now() });
    botMemory.history = botMemory.history.slice(-BOT_MAX_HISTORY);
    saveBotMemory(botMemory);
  }

  function detectName(text) {
    const match = text.match(/\b(?:my name is|call me|i am|i'm|im)\s+([a-z][a-z'\-]+(?:\s+[a-z][a-z'\-]+){0,2})/i);
    return match ? cleanDisplayName(match[1]) : '';
  }

  function detectIntent(rawText) {
    const text = normalizeText(rawText);
    const tokens = text.split(' ').filter(Boolean);

    const isShortFollowUp = tokens.length <= 5 && /^(it|that|this|there|here|more|again|what about|and )/.test(text);

    const intents = [
      { name: 'greeting', topic: 'greeting', score: /^(hi|hello|hey|sup|yo|good morning|good afternoon|good evening|howdy|hiya|what's up)/.test(text) ? 5 : 0 },
      { name: 'identity', topic: 'about', score: /(who is nikunj|about nikunj|tell me about nikunj|nikunj sorathiya|who are you|introduce yourself|tell me about yourself)/.test(text) ? 5 : 0 },
      { name: 'skills', topic: 'skills', score: /(skill|tech stack|stack|technolog|what do you know|what do you use|tools|frontend|back end|backend|react|next js|typescript|tailwind|node|express|python|api|database|ai|ml|machine learning|devops|deploy|figma)/.test(text) ? 4 : 0 },
      { name: 'projects', topic: 'projects', score: /(project|built|portfolio|work|show me|what have you made|devflow|neuralvision|shopsense|chatbase|codesynth|trackify)/.test(text) ? 4 : 0 },
      { name: 'experience', topic: 'experience', score: /(experience|how long|years coding|coding years|background|career|internship|intern|job history|previous work|achievement|award|proud)/.test(text) ? 4 : 0 },
      { name: 'availability', topic: 'availability', score: /(hire|hiring|available|availability|open to|looking for|job|full time|part time|freelance|contract|opportunity|work with|remote|onsite|relocat|timeline|deadline|delivery|rate|salary|charge|cost|price|budget|how much)/.test(text) ? 4 : 0 },
      { name: 'contact', topic: 'contact', score: /(contact|reach|email|message|get in touch|talk|connect|dm|linkedin|github|twitter|x\.com|book call|schedule|meeting|call|consultation|response time|reply fast|when reply)/.test(text) ? 4 : 0 },
      { name: 'blog', topic: 'blog', score: /(blog|article|writing|post|read|dark patterns|agi|design|this post|blog one|blog 1)/.test(text) ? 3 : 0 },
      { name: 'portfolio', topic: 'portfolio', score: /(portfolio|website|this site|built this|how made this|this website)/.test(text) ? 3 : 0 },
      { name: 'personal', topic: 'personal', score: /(education|degree|college|university|study|student|hobby|interest|free time|passion|language|speak|english|hindi|gujarati|favorite|favourite|prefer|strength|weakness|learning|currently learn|studying)/.test(text) ? 3 : 0 },
      { name: 'collaboration', topic: 'collaboration', score: /(team|collaborat|work with team|team player|agile|scrum|startup|agency|company|corporate|enterprise|open source|contribution)/.test(text) ? 3 : 0 },
    ];

    let best = intents.sort((a, b) => b.score - a.score)[0];

    if (best && best.score > 0) return best;

    if (isShortFollowUp && botMemory.lastTopic) {
      return { name: 'followup', topic: botMemory.lastTopic, score: 1 };
    }

    if (tokens.some(token => botMemory.topics.includes(token))) {
      return { name: 'context', topic: botMemory.lastTopic || 'about', score: 1 };
    }

    return { name: 'unknown', topic: botMemory.lastTopic || '', score: 0 };
  }

  function buildNaturalResponse(intent, rawText) {
    const text = normalizeText(rawText);
    const userName = botMemory.name;
    const greetingPrefix = userName ? `${pick(['Hi', 'Hey', 'Hello'])} ${userName}` : pick(['Hi', 'Hey', 'Hello']);
    const followupPrefix = botMemory.lastTopic ? pick(['On that,', 'A bit more context:', 'To add to that:', 'Here is the short version:']) : pick(['Sure.', 'Here is a concise answer.', 'Absolutely.']);

    if (botMemory.name && /^(hi|hello|hey|sup|yo|good morning|good afternoon|good evening|howdy|hiya|what's up)/.test(text)) {
      return `${greetingPrefix}! ${pick([
        'Good to see you here again.',
        'What would you like to know about Nikunj today?',
        'Happy to help with projects, skills, experience, or contact details.',
      ])}`;
    }

    if (!botMemory.name && /^(hi|hello|hey|sup|yo|good morning|good afternoon|good evening|howdy|hiya|what's up)/.test(text)) {
      return pick([
        'Hey! I can help you explore Nikunj’s skills, projects, background, availability, or contact details.',
        'Hello! Ask me naturally about Nikunj and I’ll keep the answers concise and specific.',
      ]);
    }

    if (intent.name === 'identity') {
      rememberTopic('about');
      return pick([
        'Nikunj Sorathiya is a Full Stack Developer and AI/ML enthusiast from India who builds production-focused web apps and AI-powered products.',
        'Nikunj is a developer who works across frontend, backend, and AI/ML. He focuses on shipping practical products, not just demos.',
      ]);
    }

    if (intent.topic === 'skills') {
      rememberTopic('skills');
      return pick([
        'His strongest areas are React, Next.js, TypeScript, Node.js, Python, MongoDB, PostgreSQL, and AI integration. He also cares about performance and clean UI work.',
        'Nikunj’s stack spans frontend, backend, databases, and AI. If you want, I can break it down by frontend, backend, or AI/ML.',
      ]);
    }

    if (intent.topic === 'projects') {
      rememberTopic('projects');
      return pick([
        'He has built projects like DevFlow, NeuralVision, ShopSense, ChatBase, CodeSynth, and Trackify. If you want, I can summarize any one of them.',
        'Nikunj’s portfolio includes SaaS, AI, e-commerce, and mobile projects. Ask about any project by name and I’ll give you the relevant details.',
      ]);
    }

    if (intent.topic === 'experience') {
      rememberTopic('experience');
      return pick([
        'He has solid hands-on experience building real-world apps, contributing to open source, and working across full-stack and AI-focused projects.',
        'Nikunj’s background is strongest in practical project work, product thinking, and iterative shipping. He’s more builder than theorist.',
      ]);
    }

    if (intent.topic === 'availability') {
      rememberTopic('availability');
      return pick([
        'He is open to full-time, freelance, and collaboration opportunities. For scope or timelines, the best next step is a short discovery call.',
        'Nikunj is available for remote opportunities and project work. If you share your needs, I can help frame the best way to reach out.',
      ]);
    }

    if (intent.topic === 'contact') {
      rememberTopic('contact');
      return pick([
        'You can reach him by email, LinkedIn, GitHub, or X. If you want, I can give you the most direct option for hiring, collaboration, or casual questions.',
        'The fastest route is email, but LinkedIn is also a good option for professional outreach. I can share the exact links if needed.',
      ]);
    }

    if (intent.topic === 'blog') {
      rememberTopic('blog');
      return pick([
        'The blog covers practical topics like dark patterns, AGI-era careers, and web design trends. If you want a specific post, mention the title.',
        'He writes about design, AI, and the future of work. I can point you to a specific article or summarize one for you.',
      ]);
    }

    if (intent.topic === 'portfolio') {
      rememberTopic('portfolio');
      return pick([
        'This portfolio is built with HTML, CSS, vanilla JavaScript, GSAP, and a few custom interactions. The focus is on polish without heavy frameworks.',
        'It is a handcrafted portfolio with custom animations, a bot, project showcases, and a dynamic GitHub section.',
      ]);
    }

    if (intent.topic === 'personal') {
      rememberTopic('personal');
      return pick([
        'Nikunj is still pursuing his CS/IT education while building projects and learning in public. Outside work, he tends to stay close to AI and software topics.',
        'He communicates in English, Hindi, and Gujarati, and he likes working on practical, product-oriented ideas.',
      ]);
    }

    if (intent.topic === 'collaboration') {
      rememberTopic('collaboration');
      return pick([
        'He works well in team settings, is comfortable with async communication, and usually prefers clear ownership and direct feedback.',
        'Nikunj is collaborative and adaptable. He fits well in startup-style environments, but he also handles more structured workflows when needed.',
      ]);
    }

    if (intent.name === 'followup') {
      return pick([
        `${followupPrefix} I’m still talking about ${botMemory.lastTopic}. If you want, I can go one level deeper or switch topics.`,
        `${followupPrefix} that still seems to relate to ${botMemory.lastTopic}. Ask a more specific follow-up and I’ll narrow it down.`,
      ]);
    }

    if (/^(yes|yep|yeah|sure|ok|okay|cool|thanks|thank you|got it|great)$/.test(text)) {
      return botMemory.lastTopic
        ? `Absolutely. If you want, I can expand on ${botMemory.lastTopic} or move to projects, availability, or contact details.`
        : 'Absolutely. Ask me about skills, projects, experience, availability, or contact details.';
    }

    if (/\b(my name is|call me|i am|i'm|im)\b/.test(text)) {
      const detectedName = detectName(rawText);
      if (detectedName) {
        botMemory.name = detectedName;
        saveBotMemory(botMemory);
        return `Nice to meet you, ${detectedName}. I’ll keep that in mind while we chat.`;
      }
    }

    if (/\b(more|deeper|detail|details|expand|explain|specifically)\b/.test(text) && botMemory.lastTopic) {
      return pick([
        `Sure — I can go deeper on ${botMemory.lastTopic}. What part matters most to you?`,
        `Happy to expand on ${botMemory.lastTopic}. If you want, ask about the tools, process, or examples behind it.`,
      ]);
    }

    if (/\bhelp\b/.test(text)) {
      return 'You can ask naturally, for example: "What does Nikunj build?", "Tell me more about DevFlow", "Is he available for freelance?", or "How do I contact him?"';
    }

    return null;
  }

  function handleBotResponse(text) {
    const detectedName = detectName(text);
    if (detectedName) {
      botMemory.name = detectedName;
      saveBotMemory(botMemory);
    }

    const intent = detectIntent(text);
    botMemory.lastIntent = intent.name;
    rememberHistory('user', text, intent.name);

    const response = buildNaturalResponse(intent, text) || pick([
      'I can help with Nikunj’s skills, projects, experience, availability, contact details, or blog posts. Ask naturally and I’ll answer in context.',
      'I’m not fully sure yet, but I can usually answer questions about Nikunj’s work, background, or how to reach him. Try asking in a bit more detail.',
      'If you want, ask me about a specific project, skill area, or whether Nikunj is available for work. I’ll keep it concise and useful.',
    ]);

    const delay = 350 + Math.random() * 350;
    setTimeout(() => {
      removeTyping();
      addMessage(response);
      rememberHistory('bot', response, intent.name);
    }, delay);
  }

  function buildBookingEmailPayload() {
    const bookingName = document.getElementById('b-name');
    const bookingEmail = document.getElementById('b-email');
    const bookingNotes = document.getElementById('b-notes');
    const bookingState = document.getElementById('b-state');
    const bookingCity = document.getElementById('b-city');

    return {
      name: bookingName ? bookingName.value.trim() : '',
      email: bookingEmail ? bookingEmail.value.trim() : '',
      notes: bookingNotes ? bookingNotes.value.trim() : '',
      date: selectedDate,
      time: selectedTime,
      location: selectedLocation,
      state: bookingState ? bookingState.value.trim() : '',
      city: bookingCity ? bookingCity.value.trim() : '',
    };
  }

  function validateBookingPayload(payload) {
    const errors = [];

    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.push('email');

    return { valid: errors.length === 0, errors };
  }

  window.submitBookingToFirestore = async function submitBookingToFirestore() {
    if (typeof window.saveBookingToFirestore !== 'function') {
      throw new Error('Firebase Firestore is not available yet.');
    }

    const payload = buildBookingEmailPayload();
    const validation = validateBookingPayload(payload);

    if (!validation.valid) {
      const missing = validation.errors.join(', ');
      throw new Error(`Please complete the required booking fields: ${missing}.`);
    }

    return window.saveBookingToFirestore({
      ...payload,
      notes: payload.notes || '',
    });
  };

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
  const bCity = document.getElementById('b-city');
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

  if (bCity) {
    bCity.addEventListener('input', checkStep1);
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
    confirmBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const emailValue = bEmail.value.trim();
      const nameValue = bName.value.trim();
      const bookingStatus = document.getElementById('booking-status-message');

      if (!emailValue) {
        alert('Please enter your email address so I can send the booking request.');
        return;
      }

      if (bookingStatus) {
        bookingStatus.textContent = 'Sending your booking request...';
      }

      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Sending...';

      try {
        await window.submitBookingToFirestore();
      } catch (error) {
        if (bookingStatus) {
          bookingStatus.textContent = error.message || 'Unable to save your booking right now. Please try again.';
        }
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Confirm Booking';
        return;
      }

      goToStep(2);
      document.getElementById('success-name').textContent = nameValue || 'there';
      document.getElementById('success-email').textContent = emailValue;

      // Reset form
      bName.value = '';
      bEmail.value = '';
      document.getElementById('b-notes').value = '';
      if (bDate) bDate.value = '';
      if (bState) bState.value = '';
      if (bCity) bCity.value = '';
      selectedDate = '';
      selectedTime = '';
      selectedLocation = bLocation ? bLocation.value : 'Google Meet';
      timeSlots.forEach(s => s.classList.remove('selected'));
      bNextBtn.disabled = true;

      confirmBtn.disabled = false;
      confirmBtn.innerHTML = 'Confirm Booking';

      if (bookingStatus) {
        bookingStatus.textContent = '';
      }
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

    // Update progress bar indicator
    const progressSteps = document.querySelectorAll('.booking-progress-step');
    progressSteps.forEach((pStep, i) => {
      if (i <= index) {
        pStep.classList.add('active');
      } else {
        pStep.classList.remove('active');
      }
    });
  }
}

// Reveal project card images in color when scrolled into view
(function initProjectColorReveal() {
  const cards = document.querySelectorAll('.about-page .project-card, #projects .project-card');
  if (!cards.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  cards.forEach((card) => observer.observe(card));
})();
