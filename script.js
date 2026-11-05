const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const filterBars = document.querySelectorAll(".filter-bar");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const sections = [...navAnchors]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const typingText = document.getElementById("typingText");
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const statNumbers = document.querySelectorAll(".stat-number");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialCards = document.querySelectorAll(".testimonial-card");
const sliderButtons = document.querySelectorAll("[data-slide]");
const typingWords = [
  "Bug Fixes",
  "Website Builds",
  "Frontend Polish",
  "Responsive Fixes"
];

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;

  if (themeToggleIcon) {
    themeToggleIcon.textContent = theme === "light" ? "☀" : "☾";
  }
};

const savedTheme = localStorage.getItem("portfolio-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
applyTheme(savedTheme || preferredTheme);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

filterBars.forEach((filterBar) => {
  const currentSection = filterBar.closest("section");
  const filterButtons = filterBar.querySelectorAll("[data-filter]");
  const projectCards = currentSection ? currentSection.querySelectorAll(".project-card") : [];

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      projectCards.forEach((card) => {
        const matches = selected === "all" || card.dataset.category === selected;
        card.hidden = !matches;
        card.classList.remove("is-filtering");

        if (matches) {
          window.requestAnimationFrame(() => card.classList.add("is-filtering"));
        }
      });
    });
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
}

if ("IntersectionObserver" in window && statNumbers.length) {
  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const number = entry.target;
        const target = Number(number.dataset.count || 0);
        const suffix = target === 100 ? "%" : "+";
        const duration = 1200;
        const startedAt = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          number.textContent = `${Math.round(target * eased)}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(animate);
          }
        };

        window.requestAnimationFrame(animate);
        observer.unobserve(number);
      });
    },
    { threshold: 0.55 }
  );

  statNumbers.forEach((number) => statsObserver.observe(number));
} else {
  statNumbers.forEach((number) => {
    const target = Number(number.dataset.count || 0);
    number.textContent = `${target}${target === 100 ? "%" : "+"}`;
  });
}

if (testimonialTrack && testimonialCards.length) {
  let activeSlide = 0;

  const updateSlider = () => {
    testimonialTrack.style.transform = `translateX(-${activeSlide * 100}%)`;
  };

  sliderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.slide;
      activeSlide =
        direction === "next"
          ? (activeSlide + 1) % testimonialCards.length
          : (activeSlide - 1 + testimonialCards.length) % testimonialCards.length;
      updateSlider();
    });
  });

  window.setInterval(() => {
    activeSlide = (activeSlide + 1) % testimonialCards.length;
    updateSlider();
  }, 5200);
}

if ("IntersectionObserver" in window && navAnchors.length && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const currentId = `#${entry.target.id}`;
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle("is-active", anchor.getAttribute("href") === currentId);
        });
      });
    },
    {
      threshold: 0.55,
      rootMargin: "-12% 0px -30% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

if (typingText) {
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const currentWord = typingWords[wordIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingText.textContent = currentWord.slice(0, charIndex);

    let delay = deleting ? 60 : 100;

    if (!deleting && charIndex === currentWord.length) {
      delay = 1300;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      delay = 260;
    }

    window.setTimeout(type, delay);
  };

  type();
}

/* =========================================================
   ENHANCED INTERACTIVITY, SPOTLIGHT, CURSOR & ANIMATIONS
   ========================================================= */

// 1. Ambient Particle & Floating Code Stream Canvas Network
const ambientCanvas = document.getElementById("ambientCanvas");
if (ambientCanvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const ctx = ambientCanvas.getContext("2d");
  let width = (ambientCanvas.width = window.innerWidth);
  let height = (ambientCanvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 20000), 48);
  const mouse = { x: null, y: null, radius: 140 };
  const codeTokens = ["{ }", "</>", "=>", "const", "01", "fn()", "git", ";", "<div>", "PHP", "JS", "SQL"];

  const createParticle = (i) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    radius: Math.random() * 1.5 + 0.8,
    baseAlpha: Math.random() * 0.35 + 0.2,
    isCode: i % 3 === 0,
    token: codeTokens[i % codeTokens.length],
    fontSize: Math.floor(Math.random() * 3 + 10)
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle(i));
  }

  const resizeCanvas = () => {
    width = ambientCanvas.width = window.innerWidth;
    height = ambientCanvas.height = window.innerHeight;
  };

  window.addEventListener("resize", resizeCanvas, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  let isCanvasActive = true;
  document.addEventListener("visibilitychange", () => {
    isCanvasActive = !document.hidden;
    if (isCanvasActive) {
      requestAnimationFrame(renderParticles);
    }
  });

  const renderParticles = () => {
    if (!isCanvasActive) return;

    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.dataset.theme === "light";
    const baseColor = isLight ? "36, 107, 254" : "0, 245, 255";
    const purpleColor = isLight ? "147, 51, 234" : "168, 85, 247";

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }
      }

      if (p.isCode) {
        ctx.font = `${p.fontSize}px monospace`;
        ctx.fillStyle = `rgba(${i % 2 === 0 ? baseColor : purpleColor}, ${p.baseAlpha * 0.9})`;
        ctx.fillText(p.token, p.x, p.y);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, ${p.baseAlpha})`;
        ctx.fill();
      }

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 100) {
          const lineAlpha = (1 - dist / 100) * 0.16;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${baseColor}, ${lineAlpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(renderParticles);
  };

  requestAnimationFrame(renderParticles);
}

// Background Video Controller & Toggle
const videoToggle = document.getElementById("videoToggle");
const codeBgVideo = document.getElementById("codeBgVideo");

const setVideoState = (state) => {
  if (state === "off") {
    document.body.dataset.video = "off";
    if (codeBgVideo) codeBgVideo.pause();
    if (videoToggle) {
      videoToggle.classList.add("is-off");
      videoToggle.setAttribute("title", "Enable Coding Video Background");
    }
  } else {
    document.body.dataset.video = "on";
    if (codeBgVideo) {
      codeBgVideo.play().catch(() => {});
    }
    if (videoToggle) {
      videoToggle.classList.remove("is-off");
      videoToggle.setAttribute("title", "Pause Coding Video Background");
    }
  }
};

const savedVideoPref = localStorage.getItem("portfolio-video-bg");
setVideoState(savedVideoPref || "on");

if (videoToggle) {
  videoToggle.addEventListener("click", () => {
    const nextState = document.body.dataset.video === "off" ? "on" : "off";
    localStorage.setItem("portfolio-video-bg", nextState);
    setVideoState(nextState);
  });
}

// 2. Card Spotlight & 3D Tilt Effect
const interactiveCards = document.querySelectorAll(
  ".project-card, .service-card, .tech-card, .timeline-card, .stat-card, .repo-card, .process-card, .hero-stage, .stage-card, .metric-block, .contact-card, .about-quote-card, .floating-badge"
);

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // Subtle 3D tilt (skip on stage/large containers for comfort)
    if (!card.classList.contains("hero-stage") && !card.classList.contains("floating-badge")) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
    }
  });

  card.addEventListener("mouseleave", () => {
    if (!card.classList.contains("hero-stage") && !card.classList.contains("floating-badge")) {
      card.style.transform = "";
    }
  });
});

// 3. Custom Cursor Glow & Dot
const cursorGlow = document.getElementById("cursorGlow");
const cursorDot = document.getElementById("cursorDot");

if (cursorGlow && cursorDot && window.matchMedia("(pointer: fine) and (hover: hover)").matches) {
  let targetX = -100;
  let targetY = -100;
  let currentX = -100;
  let currentY = -100;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    cursorDot.style.transform = `translate(${targetX}px, ${targetY}px)`;
  });

  const renderCursor = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(renderCursor);
  };
  requestAnimationFrame(renderCursor);

  // Hover states on clickable items
  const clickables = document.querySelectorAll(
    "a, button, input, textarea, .filter-chip, .tech-card, .project-card, .service-card, .stat-card, .problem-pill"
  );

  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
    cursorDot.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    cursorGlow.style.opacity = "1";
    cursorDot.style.opacity = "1";
  });
}

// 4. Scroll Progress Bar & Topbar Scrolled Class & Back to Top Button
const scrollProgressBar = document.getElementById("scrollProgressBar");
const scrollTopBtn = document.getElementById("scrollTopBtn");
const topbar = document.querySelector(".topbar");

const updateScrollStates = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (scrollProgressBar) {
    scrollProgressBar.style.width = `${scrollPercent}%`;
  }

  if (topbar) {
    topbar.classList.toggle("is-scrolled", scrollTop > 40);
  }

  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("is-active", scrollTop > 380);
  }
};

window.addEventListener("scroll", updateScrollStates, { passive: true });
updateScrollStates();

if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// 5. Animated Skills Progress Bars on Viewport Enter
const skillBars = document.querySelectorAll(".progress-bar-fill");
if ("IntersectionObserver" in window && skillBars.length) {
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetProgress = bar.dataset.progress || 90;
          bar.style.width = `${targetProgress}%`;
          obs.unobserve(bar);
        }
      });
    },
    { threshold: 0.35 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
} else {
  skillBars.forEach((bar) => {
    bar.style.width = `${bar.dataset.progress || 90}%`;
  });
}

// 6. Button Click Ripple Effect
document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", (e) => {
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add("ripple");

    const existingRipple = button.querySelector(".ripple");
    if (existingRipple) {
      existingRipple.remove();
    }

    button.appendChild(circle);
    window.setTimeout(() => circle.remove(), 600);
  });
});

/* =========================================================
   7. MATRIX DIGITAL RAIN ANIMATION ENGINE
   ========================================================= */
const matrixCanvas = document.getElementById("matrixCanvas");
if (matrixCanvas) {
  const ctx = matrixCanvas.getContext("2d");
  let animationFrameId;
  let width = (matrixCanvas.width = window.innerWidth);
  let height = (matrixCanvas.height = window.innerHeight);

  const characters = "01010101<>{}[]/*=+~#$_ABCDEFabcdef0123456789";
  const fontSize = 16;
  let columns = Math.floor(width / fontSize);
  let drops = [];

  const initDrops = () => {
    width = matrixCanvas.width = window.innerWidth;
    height = matrixCanvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }
  };

  initDrops();

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  let lastFrameTime = 0;
  const targetFPS = 33; // ~30 fps is ideal for authentic terminal rain feel and battery saving
  const frameInterval = 1000 / targetFPS;

  const drawMatrix = (currentTime) => {
    animationFrameId = requestAnimationFrame(drawMatrix);

    // In Light Mode, keep canvas 100% clear and pristine
    const isLight = document.body.dataset.theme === "light";
    if (isLight) {
      ctx.clearRect(0, 0, width, height);
      return;
    }

    const delta = currentTime - lastFrameTime;
    if (delta < frameInterval) return;
    lastFrameTime = currentTime - (delta % frameInterval);

    // Translucent black fade to create falling trails
    ctx.fillStyle = "rgba(3, 7, 18, 0.09)";
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px "JetBrains Mono", Consolas, monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Mouse ripple glow interaction
      const distToMouse = Math.hypot(x - mouseX, y - mouseY);
      if (distToMouse < 120) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00f5ff";
      } else if (Math.random() > 0.94) {
        // Bright leading head drop
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00f5ff";
      } else {
        // Neon cyber green/cyan body
        ctx.fillStyle = i % 3 === 0 ? "#00f5ff" : "#10b981";
        ctx.shadowBlur = 0;
      }

      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };

  animationFrameId = requestAnimationFrame(drawMatrix);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initDrops, 250);
  });
}

/* =========================================================
   8. WEB AUDIO API SYNTHESIZER (Sci-Fi Sound FX)
   ========================================================= */
let audioCtx = null;
let soundEnabled = localStorage.getItem("saurabh_sound_fx") === "true";

const soundToggleBtn = document.getElementById("soundToggleBtn");
const soundIcon = document.getElementById("soundIcon");

const updateSoundUI = () => {
  if (soundToggleBtn && soundIcon) {
    soundToggleBtn.classList.toggle("is-active", soundEnabled);
    soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    soundToggleBtn.setAttribute(
      "aria-label",
      soundEnabled ? "Mute sound effects" : "Unmute sound effects"
    );
  }
};

const playCyberBeep = (freq = 880, type = "sine", duration = 0.08) => {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // AudioContext blocked or not supported
  }
};

if (soundToggleBtn) {
  updateSoundUI();
  soundToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("saurabh_sound_fx", soundEnabled);
    updateSoundUI();
    if (soundEnabled) {
      playCyberBeep(980, "triangle", 0.12);
    }
  });
}

// Trigger sound on interactive elements
document.querySelectorAll(".button, .mode-toggle-btn, .run-code-btn").forEach((btn) => {
  btn.addEventListener("click", () => playCyberBeep(720, "sine", 0.06));
});

/* =========================================================
   9. VISUAL BACKGROUND MODE SWITCHER
   ========================================================= */
const modeToggleBtn = document.getElementById("modeToggleBtn");
const modeIcon = document.getElementById("modeIcon");
const modeLabel = document.getElementById("modeLabel");
const siteShell = document.querySelector(".site-shell");

const visualModes = [
  { id: "matrix", label: "Matrix", icon: "🟢" },
  { id: "cyber", label: "Cyber Glow", icon: "🟣" },
  { id: "space", label: "Deep Space", icon: "🔵" },
  { id: "video", label: "Video BG", icon: "🎬" }
];

let currentModeIndex = 0;
const savedMode = localStorage.getItem("saurabh_bg_mode");
if (savedMode) {
  const foundIndex = visualModes.findIndex((m) => m.id === savedMode);
  if (foundIndex !== -1) currentModeIndex = foundIndex;
}

const applyBgMode = (index) => {
  const mode = visualModes[index];
  if (siteShell) {
    siteShell.dataset.bgMode = mode.id;
  }
  if (modeIcon) modeIcon.textContent = mode.icon;
  if (modeLabel) modeLabel.textContent = mode.label;
  localStorage.setItem("saurabh_bg_mode", mode.id);
};

applyBgMode(currentModeIndex);

if (modeToggleBtn) {
  modeToggleBtn.addEventListener("click", () => {
    currentModeIndex = (currentModeIndex + 1) % visualModes.length;
    applyBgMode(currentModeIndex);
    playCyberBeep(1200, "sine", 0.08);
  });
}

/* =========================================================
   10. INTERACTIVE LIVE VS CODE PIPELINE RUNNER
   ========================================================= */
const runCodeBtn = document.getElementById("runCodeBtn");
const terminalOutput = document.getElementById("terminalOutput");
const terminalBadge = document.getElementById("terminalBadge");
let isRunningPipeline = false;

if (runCodeBtn && terminalOutput) {
  runCodeBtn.addEventListener("click", () => {
    if (isRunningPipeline) return;
    isRunningPipeline = true;
    runCodeBtn.disabled = true;
    runCodeBtn.style.opacity = "0.7";
    if (terminalBadge) {
      terminalBadge.textContent = "BUILDING...";
      terminalBadge.style.color = "#f59e0b";
      terminalBadge.style.borderColor = "rgba(245, 158, 11, 0.4)";
    }

    const steps = [
      { text: "> saurabh-cli build --optimize --prod", delay: 200, color: "#38bdf8" },
      { text: "✔ [1/4] Linting JavaScript & PHP architecture... (0 errors, clean code)", delay: 600, color: "#10b981" },
      { text: "✔ [2/4] Optimizing CSS, Tailwind & responsive layouts... (-52% bundle size)", delay: 1100, color: "#00f5ff" },
      { text: "✔ [3/4] Running Core Web Vitals & Lighthouse audit: Score 100/100 ⚡", delay: 1600, color: "#a855f7" },
      { text: "✔ [4/4] Automated bug fixing engine deployed successfully 🚀", delay: 2100, color: "#10b981" },
      { text: "✨ Live site compiled with zero layout shifts. 100% Client Satisfaction!", delay: 2600, color: "#fbbf24" }
    ];

    terminalOutput.innerHTML = "";

    steps.forEach((step, index) => {
      setTimeout(() => {
        const line = document.createElement("div");
        line.className = "term-line";
        line.style.color = step.color;
        line.textContent = step.text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        playCyberBeep(600 + index * 120, "sine", 0.04);

        if (index === steps.length - 1) {
          isRunningPipeline = false;
          runCodeBtn.disabled = false;
          runCodeBtn.style.opacity = "1";
          if (terminalBadge) {
            terminalBadge.textContent = "VERIFIED ✓";
            terminalBadge.style.color = "#10b981";
            terminalBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
          }
        }
      }, step.delay);
    });
  });
}

/* =========================================================
   11. INTERACTIVE BEFORE & AFTER COMPARISON SLIDER
   ========================================================= */
const baBox = document.getElementById("baBox");
const baDivider = document.getElementById("baDivider");
const baAfterLayer = document.getElementById("baAfterLayer");

if (baBox && baDivider && baAfterLayer) {
  let isDragging = false;

  const setSliderPosition = (clientX) => {
    const rect = baBox.getBoundingClientRect();
    let offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    // Constrain between 5% and 95%
    percentage = Math.max(5, Math.min(95, percentage));

    baAfterLayer.style.width = `${percentage}%`;
    baDivider.style.left = `${percentage}%`;
  };

  // Mouse drag events
  baBox.addEventListener("mousedown", (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch drag events for mobile / tablets
  baBox.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      if (e.touches && e.touches[0]) {
        setSliderPosition(e.touches[0].clientX);
      }
    },
    { passive: true }
  );

  window.addEventListener("touchend", () => {
    isDragging = false;
  });

  window.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        setSliderPosition(e.touches[0].clientX);
      }
    },
    { passive: true }
  );
}
