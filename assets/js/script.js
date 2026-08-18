"use strict";
// body js start---
// scroll-reveal js start--
(() => {
  const groups = document.querySelectorAll(".reveal-group");
  if (!groups.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    groups.forEach((group) => group.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
  );

  groups.forEach((group) => observer.observe(group));
})();
// scroll-reveal js end--

// smooth-scroll js start--
(() => {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const canHover = window.matchMedia("(pointer: fine)").matches;
  if (reduceMotion || !canHover) return;

  const ease = 0.1;
  const LINE_HEIGHT = 34; // px per "line" when a device reports DOM_DELTA_LINE
  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = null;

  const maxScroll = () =>
    document.documentElement.scrollHeight - window.innerHeight;

  // scroll-behavior:smooth (set on html/body for anchor jumps) intercepts
  // plain scrollTo(x, y) calls and animates them natively — which stacks
  // with our own easing below and makes the page fall further and further
  // behind the cursor. behavior:"auto" forces an instant, exact jump each
  // frame so our lerp is the only easing in effect.
  const jumpTo = (y) =>
    window.scrollTo({ top: y, left: 0, behavior: "instant" });

  const normalizeDelta = (e) => {
    if (e.deltaMode === 1) return e.deltaY * LINE_HEIGHT; // DOM_DELTA_LINE
    if (e.deltaMode === 2) return e.deltaY * window.innerHeight; // DOM_DELTA_PAGE
    return e.deltaY; // DOM_DELTA_PIXEL
  };

  const tick = () => {
    current += (target - current) * ease;

    if (Math.abs(target - current) < 0.5) {
      current = target;
      jumpTo(current);
      rafId = null;
      return;
    }

    jumpTo(current);
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  };

  window.addEventListener(
    "wheel",
    (e) => {
      if (document.body.classList.contains("active")) return;
      if (e.ctrlKey) return; // let pinch-zoom through untouched

      e.preventDefault();
      target += normalizeDelta(e);
      target = Math.max(0, Math.min(target, maxScroll()));
      start();
    },
    { passive: false },
  );

  // Keep the eased scroll in sync with keyboard/scrollbar/anchor jumps
  window.addEventListener(
    "scroll",
    () => {
      if (rafId !== null) return;
      current = window.scrollY;
      target = window.scrollY;
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    target = Math.min(target, maxScroll());
  });
})();
// smooth-scroll js end--
// body js start---

// mobile-menu sidebar js start---
const mobileMenu = document.querySelector(".navbar-right");
const mobileMenuContainer = document.querySelector(".nav-links");

function openMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.add("active");
  mobileMenuContainer?.classList.add("active");
}

function closeMobileMenu(event) {
  event.stopPropagation();
  mobileMenu?.classList.remove("active");
  mobileMenuContainer?.classList.remove("active");
}

document.querySelectorAll(".mobile-menu-open").forEach((btn) => {
  btn.addEventListener("click", openMobileMenu);
});

document
  .querySelectorAll(".mobile-menu-window-cls-btn, .mobile-menu-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeMobileMenu);
  });

// mobile-menu sidebar js end---

// membership-section js start--
(() => {
  const section = document.querySelector(".membership-section");
  const wrap = section?.querySelector(".membership-wrap");
  if (!section || !wrap) return;

  const badges = [...section.querySelectorAll(".membership-badge")];
  const parallaxEls = badges.map((badge) =>
    badge.querySelector(".membership-parallax"),
  );

  // Each badge drifts a different amount so the cursor effect feels layered
  // instead of every circle moving in lockstep.
  const depths = badges.map((_, i) => 10 + ((i * 37) % 22));

  badges.forEach((badge, i) => {
    badge.style.setProperty("--pop-delay", `${i * 0.06}s`);
    badge.style.setProperty("--float-delay", `${(i % 6) * 0.35}s`);
  });

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reduceMotion) {
    section.classList.add("in-view");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        section.classList.add("in-view");
        observer.unobserve(section);
      });
    },
    { threshold: 0.25 },
  );

  observer.observe(section);

  // Cursor-follow parallax: badges drift toward the cursor, each at its own
  // depth, and ease back to rest when the cursor leaves.
  const canHover = window.matchMedia("(pointer: fine)").matches;
  if (!canHover) return;

  let targetX = 0;
  let targetY = 0;
  let rafId = null;

  const applyParallax = () => {
    rafId = null;
    parallaxEls.forEach((el, i) => {
      if (!el) return;
      const depth = depths[i];
      el.style.setProperty("--px", `${targetX * depth}px`);
      el.style.setProperty("--py", `${targetY * depth}px`);
    });
  };

  const queueParallax = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(applyParallax);
  };

  wrap.addEventListener("mousemove", (e) => {
    const rect = wrap.getBoundingClientRect();
    targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    queueParallax();
  });

  wrap.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    queueParallax();
  });
})();
// membership-section js end--

// image-category-slider js start--
var swiper = new Swiper(".testimonial-slider", {
  slidesPerView: 2.66,
  spaceBetween: 24,
  grabCursor: true,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  breakpoints: {
    // when window width is >= 320px
    1: {
      spaceBetween: 10,
      slidesPerView: 1,
    },
    // when window width is >= 576px
    576: {
      spaceBetween: 10,
      slidesPerView: 1.3,
    },
    // when window width is >= 767px
    768: {
      spaceBetween: 16,
      slidesPerView: 1.8,
    },
    // when window width is >= 992px
    992: {
      spaceBetween: 24,
      slidesPerView: 2.66,
    },
  },
});
// image-category-slider js end--


// hero-parallax js start--
(() => {
  const hero = document.querySelector(".hero-section");
  if (!hero) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const progress = Math.max(-1, Math.min(1, -rect.top / (rect.height || 1)));
    const maxShift = Math.min(rect.height * 0.08, 80);
    const shift = progress * maxShift;
    hero.style.backgroundPosition = `center calc(50% + ${shift}px)`;
  };

  const queue = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();
})();
// hero-parallax js end--

// text-reveal js start--
(() => {
  const targets = document.querySelectorAll(".text-reveal");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  // Wraps each non-space character in its own span (the gradient-clip color
  // wipe lives on it directly — see main.css), with each word's characters
  // grouped under a nowrap wrapper so the browser still only wraps lines
  // between words, not in the middle of one. Whitespace stays as plain text.
  // Only touches elements whose only children are text nodes and <br> —
  // anything more complex is left untouched.
  const splitIntoChars = (el) => {
    const nodes = [...el.childNodes];
    const isSimple = nodes.every(
      (n) =>
        n.nodeType === Node.TEXT_NODE ||
        (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR"),
    );
    if (!isSimple) return [];

    const frag = document.createDocumentFragment();
    const chars = [];

    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "BR") {
        frag.appendChild(document.createElement("br"));
        return;
      }

      node.textContent.split(/(\s+)/).forEach((chunk) => {
        if (!chunk) return;
        if (!chunk.trim()) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }

        const wordGroup = document.createElement("span");
        wordGroup.className = "word-group";

        Array.from(chunk).forEach((ch) => {
          const span = document.createElement("span");
          span.className = "char";
          span.textContent = ch;
          wordGroup.appendChild(span);
          chars.push(span);
        });

        frag.appendChild(wordGroup);
      });
    });

    el.innerHTML = "";
    el.appendChild(frag);
    return chars;
  };

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const items = [...targets]
    .map((el) => ({ el, chars: splitIntoChars(el) }))
    .filter((item) => item.chars.length);

  if (!items.length) return;

  // Each heading's fill progress is 0 while its top sits at 85% of the
  // viewport height, 1 once it reaches 35% — recalculated every scroll
  // frame from actual scroll position, not a fixed timer, so the reveal
  // stays tied to scroll: keep scrolling and more letters light up, scroll
  // back up and they drain back out. Letters are staggered within that
  // window so they still cascade rather than lighting up together.
  const updateItem = ({ el, chars }) => {
    const rect = el.getBoundingClientRect();
    const startY = window.innerHeight * 0.85;
    const endY = window.innerHeight * 0.35;
    const progress = clamp01((startY - rect.top) / (startY - endY));

    const n = chars.length;
    const spread = 0.8; // portion of the window spent staggering letter starts
    chars.forEach((char, i) => {
      const charStart = (i / n) * spread;
      const charDuration = 1 - spread + spread / n;
      const local = clamp01((progress - charStart) / charDuration);
      char.style.setProperty("--wp", `${(100 - local * 100).toFixed(1)}%`);
    });
  };

  const updateAll = () => items.forEach(updateItem);

  let ticking = false;
  const queue = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateAll();
    });
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  updateAll();
})();
// text-reveal js end--
