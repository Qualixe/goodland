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

// char-reveal js start--
(() => {
  const targets = document.querySelectorAll(".char-reveal");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  // Splits into one span per non-space character, grouped per word under a
  // nowrap wrapper so the browser still only wraps lines between words.
  // Only runs on elements whose only children are text nodes and <br> —
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
          span.className = "hchar";
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

  // Per-character stagger, scaled so each heading's whole cascade stays
  // around ~600ms regardless of its length (matching the reference site's
  // dynamically computed constant), clamped to a sensible pace at very
  // short/long texts.
  const STAGGER_BUDGET_MS = 600;

  const items = [...targets]
    .map((el) => ({ el, chars: splitIntoChars(el) }))
    .filter((item) => item.chars.length);

  if (!items.length) return;

  items.forEach(({ chars }) => {
    const step = chars.length > 1
      ? Math.min(45, Math.max(15, STAGGER_BUDGET_MS / (chars.length - 1)))
      : 0;
    chars.forEach((char, i) => {
      char.style.setProperty("--hd", `${Math.round(i * step)}ms`);
    });
  });

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

  items.forEach(({ el }) => observer.observe(el));
})();
// char-reveal js end--

// text-reveal js start--
(() => {
  const targets = document.querySelectorAll(".text-reveal");
  if (!targets.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return;

  // Captures the element's original simple content (text + <br>) once, so
  // it can be rebuilt from scratch on resize. Only elements whose only
  // children are text nodes and <br> are handled — anything more complex
  // is left untouched.
  const captureOriginal = (el) => {
    const nodes = [...el.childNodes];
    const isSimple = nodes.every(
      (n) =>
        n.nodeType === Node.TEXT_NODE ||
        (n.nodeType === Node.ELEMENT_NODE && n.tagName === "BR"),
    );
    if (!isSimple) return null;
    return nodes.map((n) =>
      n.nodeType === Node.ELEMENT_NODE
        ? { type: "br" }
        : { type: "text", value: n.textContent },
    );
  };

  // Splitting by *line* means measuring where the browser actually wraps —
  // words don't tell you that on their own. Renders the text as word spans
  // first (each carrying its own trailing space so spacing survives being
  // moved), reads each word's offsetTop to detect line boundaries (a real
  // wrap and an original <br> both show up as a jump), then regroups the
  // words into one block-level span per line.
  const splitIntoLines = (el, original) => {
    const tempFrag = document.createDocumentFragment();
    const words = [];

    original.forEach((part) => {
      if (part.type === "br") {
        tempFrag.appendChild(document.createElement("br"));
        return;
      }

      const parts = part.value.split(/(\s+)/).filter((p) => p !== "");
      parts.forEach((chunk, i) => {
        if (!chunk.trim()) return;
        const span = document.createElement("span");
        const nextIsSpace = parts[i + 1] && !parts[i + 1].trim();
        span.textContent = chunk + (nextIsSpace ? " " : "");
        tempFrag.appendChild(span);
        words.push(span);
      });
    });

    if (!words.length) return [];

    el.innerHTML = "";
    el.appendChild(tempFrag);

    const lineGroups = [];
    let lastTop = null;
    words.forEach((word) => {
      const top = word.offsetTop;
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        lineGroups.push([]);
        lastTop = top;
      }
      lineGroups[lineGroups.length - 1].push(word);
    });

    const finalFrag = document.createDocumentFragment();
    const lines = lineGroups.map((group) => {
      const lineSpan = document.createElement("span");
      lineSpan.className = "trline";
      group.forEach((word) => lineSpan.appendChild(word));
      finalFrag.appendChild(lineSpan);
      return lineSpan;
    });

    el.innerHTML = "";
    el.appendChild(finalFrag);
    return lines;
  };

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const items = [...targets]
    .map((el) => {
      const original = captureOriginal(el);
      if (!original) return null;
      return { el, original, lines: splitIntoLines(el, original) };
    })
    .filter((item) => item && item.lines.length);

  if (!items.length) return;

  // Progress is 0 while the heading's top sits at 85% of the viewport
  // height, 1 once it reaches 35% — recalculated continuously from actual
  // scroll position, so scrolling back up drains the wipe back out. Lines
  // are sequenced within that same progress (85% of the window spent
  // staggering line starts) so one line finishes filling before the next
  // starts, rather than every line filling together.
  const updateItem = ({ el, lines }) => {
    const rect = el.getBoundingClientRect();
    const startY = window.innerHeight * 0.85;
    const endY = window.innerHeight * 0.35;
    const progress = clamp01((startY - rect.top) / (startY - endY));

    const n = lines.length;
    const spread = 0.85;
    lines.forEach((line, i) => {
      const lineStart = (i / n) * spread;
      const lineDuration = 1 - spread + spread / n;
      const local = clamp01((progress - lineStart) / lineDuration);
      line.style.setProperty("--wp", `${(local * 100).toFixed(1)}%`);
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

  // Line wrapping depends on viewport width, so re-measure on resize.
  let resizeTimer = null;
  const handleResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      items.forEach((item) => {
        item.lines = splitIntoLines(item.el, item.original);
      });
      updateAll();
    }, 150);
  };

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", handleResize);
  updateAll();
})();
// text-reveal js end--

// counter-up js start--
(() => {
  const section = document.querySelector(".counter-section");
  const els = document.querySelectorAll(".counter-number");
  if (!section || !els.length) return;

  // Only counts up values that are purely numeric (with optional thousands
  // commas and a trailing "+"), e.g. "2", "10", "11,000+". Anything else —
  // "Pro", "6A-12A" — isn't a real number, so it's left completely alone.
  const parsed = [...els]
    .map((el) => {
      const match = el.textContent.trim().match(/^([\d,]+)(\+?)$/);
      if (!match) return null;
      return {
        el,
        target: parseInt(match[1].replace(/,/g, ""), 10),
        suffix: match[2],
      };
    })
    .filter(Boolean);

  if (!parsed.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) return; // leave the static target values already in the DOM

  const animateCount = ({ el, target, suffix }, duration = 1600) => {
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString("en-US") + suffix;

      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("en-US") + suffix;
    };

    el.textContent = "0" + suffix;
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        parsed.forEach((item) => animateCount(item));
        observer.unobserve(section);
      });
    },
    { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
  );

  observer.observe(section);
})();
// counter-up js end--

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

