const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const sections = [...navAnchors]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const typingText = document.getElementById("typingText");
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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    projectCards.forEach((card) => {
      const matches = selected === "all" || card.dataset.category === selected;
      card.hidden = !matches;
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
