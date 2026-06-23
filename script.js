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
