"use strict";
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

// mobile-menu-tab js start--
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".mobile-menu-tabs-contents");
  const tabs = [...document.querySelectorAll(".mobile-menu-tab")];
  const contents = [...document.querySelectorAll(".mobile-menu-tabs-content")];

  if (!container || !tabs.length || !contents.length) return;

  let isClickScroll = false;
  let scrollTimer;

  const setActive = (id, scroll = true) => {
    const tab = tabs.find((el) => el.hash === `#${id}`);
    if (!tab) return;

    tabs.forEach((el) => el.classList.toggle("active", el === tab));

    if (scroll) {
      tab.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Tab click
  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();

      const target = document.getElementById(tab.hash.slice(1));
      if (!target) return;

      isClickScroll = true;
      setActive(target.id);

      container.scrollTo({
        top: target.offsetTop - container.offsetTop - 12,
        behavior: "smooth",
      });

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isClickScroll = false;
      }, 2000);
    });
  });

  // Content scroll
  const observer = new IntersectionObserver(
    (entries) => {
      if (isClickScroll) return;

      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) setActive(visible.target.id);
    },
    {
      root: container,
      rootMargin: "-10% 0px -55% 0px",
      threshold: [0.15, 0.3, 0.5, 0.75],
    },
  );

  contents.forEach((content) => observer.observe(content));

  // Initial state
  setActive(
    tabs.find((tab) => tab.classList.contains("active"))?.hash.slice(1) ||
      tabs[0].hash.slice(1),
    false,
  );
});
// mobile-menu-tab js end--

// cart-drawer js start---
const cartDrawer = document.querySelector(".cart-drawer");
const cartDrawerInner = document.querySelector(".cart-drawer-inner");

function openCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.add("active");
  cartDrawerInner?.classList.add("active");
}

function closeCartDrawer(event) {
  event.stopPropagation();
  cartDrawer?.classList.remove("active");
  cartDrawerInner?.classList.remove("active");
}

document.querySelectorAll(".cart-drawer-open").forEach((btn) => {
  btn.addEventListener("click", openCartDrawer);
});

document
  .querySelectorAll(".cart-drawer-close-window-btn, .cart-drawer-close-btn")
  .forEach((btn) => {
    btn.addEventListener("click", closeCartDrawer);
  });

// cart-drawer js end---

// cart-drawer slider js start--
var swiper = new Swiper(".cart-drawer-slider", {
  slidesPerView: 1.3,
  spaceBetween: 16,
  grabCursor: true,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: ".cart-drawer-slider-btn-next",
    prevEl: ".cart-drawer-slider-btn-prev",
  },
});
// cart-drawer slider js end--

// cart-drawer progesss-bar js start--
const progress = document.querySelector(".progress");
progress?.addEventListener("input", function () {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #d55a3c 0%, #422c26 ${value}%,rgb(236 219 216) ${value}%)`;
});
// cart-drawer progesss-bar js end--

// hero slider js start--
var swiper = new Swiper(".hero-slider", {
  slidesPerView: 1,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".hero-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero-button-next",
    prevEl: ".hero-button-prev",
  },
  breakpoints: {
    1: {
      spaceBetween: 0,
    },
    993: {
      spaceBetween: 16,
    },
  },
});
// hero slider js end--

// category js start--
var swiper = new Swiper(".category-slider", {
  slidesPerView: "auto",
  spaceBetween: 10,
  grabCursor: true,
  loop: false,
});
// category js end--

// count-down js start--
document.querySelectorAll(".countdown").forEach((countdown) => {
  const endDate = new Date(countdown.dataset.end).getTime();

  const daysEl = countdown.querySelector(".countdown-days");
  const hoursEl = countdown.querySelector(".countdown-hours");
  const minutesEl = countdown.querySelector(".countdown-minutes");
  const secondsEl = countdown.querySelector(".countdown-seconds");

  const updateCountdown = () => {
    const remaining = endDate - Date.now();

    if (remaining <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
});
// count-down js end--

// card slider js start--
var swiper = new Swiper(".card-slider", {
  effect: "coverflow",
  slidesPerView: 1.6,
  centeredSlides: true,
  grabCursor: true,
  spaceBetween: 16,
  loop: true,
  speed: 500,
  autoplay: false,
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 150,
    modifier: 1,
    slideShadows: false,
  },
  // autoplay: {
  //   delay: 3500,
  //   disableOnInteraction: false,
  // },
  breakpoints: {
    1: {
      effect: "coverflow",
      slidesPerView: 1.4,
      centeredSlides: true,
      spaceBetween: 24,
    },
    576: {
      effect: "coverflow",
      slidesPerView: 2.2,
      centeredSlides: true,
      spaceBetween: 16,
    },
    768: {
      effect: "slide",
      slidesPerView: 3.2,
      centeredSlides: false,
      spaceBetween: 10,
    },
    993: {
      effect: "slide",
      slidesPerView: 3.8,
      centeredSlides: false,
      spaceBetween: 10,
    },
    1200: {
      effect: "slide",
      slidesPerView: 4.5,
      centeredSlides: false,
      spaceBetween: 10,
    },
  },
});
// card slider js end--

// tab-section js start--
document.querySelectorAll(".tab-section-nav-item").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    document
      .querySelectorAll(".tab-section-nav-item")
      .forEach((el) => el.classList.toggle("active", el === tab));

    document
      .querySelectorAll(".tab-section-panel")
      .forEach((panel) =>
        panel.classList.toggle("active", panel.id === target),
      );
  });
});
// tab-section js end--

// image-category-slider js start--
var swiper = new Swiper(".image-category-slider", {
  slidesPerView: 4,
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  breakpoints: {
    // when window width is >= 320px
    1: {
      spaceBetween: 10,
      slidesPerView: 1.7,
    },
    // when window width is >= 576px
    576: {
      spaceBetween: 10,
      slidesPerView: 2.2,
    },
    // when window width is >= 767px
    768: {
      spaceBetween: 16,
      slidesPerView: 3.3,
    },
    // when window width is >= 993px
    993: {
      spaceBetween: 20,
      slidesPerView: 4,
    },
  },
});
// image-category-slider js end--

// community-review popup js start--
(function () {
  const items = document.querySelectorAll(".community-review-item");
  const popup = document.querySelector(".community-review-popup");

  if (!popup || !items.length) return;

  const slides = [...popup.querySelectorAll(".community-review-popup-slide")];
  const videos = slides.map((slide) =>
    slide.querySelector(".community-review-popup-video"),
  );
  const progressBars = [
    ...popup.querySelectorAll(".community-review-popup-progress-bar"),
  ];
  const prevBtn = popup.querySelector(".community-review-popup-nav-btn.prev");
  const nextBtn = popup.querySelector(".community-review-popup-nav-btn.next");
  const muteBtn = popup.querySelector(".community-review-popup-mute-btn");
  const productImg = popup.querySelector(
    ".community-review-popup-product-img img",
  );
  const productTitle = popup.querySelector(
    ".community-review-popup-product-title",
  );
  const productPrice = popup.querySelector(
    ".community-review-popup-product-price .curr",
  );
  const productPrevPrice = popup.querySelector(
    ".community-review-popup-product-price .prev",
  );

  let current = 0;
  let muted = true;

  function pauseAll() {
    videos.forEach((video) => {
      video.pause();
      video.currentTime = 0;
    });
  }

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;

    pauseAll();
    current = index;

    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));

    progressBars.forEach((bar, i) => {
      bar.classList.toggle("completed", i < index);
      bar.querySelector("i").style.width = i < index ? "100%" : "0%";
    });

    const slide = slides[index];
    productImg.src = slide.dataset.productImg;
    productTitle.textContent = slide.dataset.productTitle;
    productPrice.textContent = slide.dataset.productPrice;
    productPrevPrice.textContent = slide.dataset.productPreviousPrice;

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    const video = videos[index];
    video.muted = muted;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  function openPopup(index) {
    document.body.classList.add("active");
    popup.classList.add("active");
    goTo(index);
  }

  function closePopup() {
    popup.classList.remove("active");
    document.body.classList.remove("active");
    pauseAll();
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      openPopup(Number(item.dataset.reviewIndex) || 0);
    });
  });

  popup
    .querySelector(".community-review-popup-close-window-btn")
    .addEventListener("click", closePopup);
  popup
    .querySelector(".community-review-popup-close-btn")
    .addEventListener("click", closePopup);

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    videos[current].muted = muted;
    muteBtn.classList.toggle("unmuted", !muted);
  });

  popup.querySelectorAll(".community-review-popup-share-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href });
      }
    });
  });

  videos.forEach((video, i) => {
    video.addEventListener("timeupdate", () => {
      if (i !== current || !video.duration) return;
      progressBars[i].querySelector("i").style.width =
        (video.currentTime / video.duration) * 100 + "%";
    });

    video.addEventListener("ended", () => {
      if (i === current && current < slides.length - 1) {
        goTo(current + 1);
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (!popup.classList.contains("active")) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "ArrowRight") goTo(current + 1);
    if (e.key === "ArrowLeft") goTo(current - 1);
  });
})();
// community-review popup js end--

// collection-category-slider js start--
var swiper = new Swiper(".collection-category-slider", {
  slidesPerView: "auto",
  spaceBetween: 20,
  grabCursor: true,
  loop: false,
  breakpoints: {
    1: {
      spaceBetween: 10,
    },
    576: {
      spaceBetween: 20,
    },
  },
});
// collection-category-slider js end--

// collection filter js start---
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".collection-filter");

  // Filter sidebar
  document
    .querySelectorAll(
      ".filter-open-btn, .filter-window-close-btn, .filter-close-btn",
    )
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = btn.classList.contains("filter-open-btn");

        sidebar?.classList.toggle("active", open);
        document.body.classList.toggle("active", open);
      });
    });

  // Accordion
  document.querySelectorAll(".accordion-toggle-btn").forEach((btn) => {
    const content = btn.nextElementSibling;

    content.style.maxHeight = `${content.scrollHeight}px`;
    btn.parentElement.classList.add("active");

    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("active");

      content.style.maxHeight = content.style.maxHeight
        ? null
        : `${content.scrollHeight}px`;
    });
  });
});
// collection filter js end---

// product-slider js start---
var swiper = new Swiper(".product-slider-thumb", {
  direction: "vertical",
  loop: false,
  spaceBetween: 20,
  slidesPerView: 5,
  freeMode: true,
  mousewheel: true,
  breakpoints: {
    // when window width is >= 320px
    1: {
      direction: "horizontal",
      spaceBetween: 10,
      slidesPerView: 4,
    },
    // when window width is >= 576px
    576: {
      direction: "horizontal",
      spaceBetween: 20,
      slidesPerView: 5,
    },
    // when window width is >= 767px
    768: {
      direction: "vertical",
      spaceBetween: 20,
      slidesPerView: 5,
    },
    // when window width is >= 767px
    993: {
      direction: "vertical",
    },
  },
});
var swiper2 = new Swiper(".product-slider", {
  loop: true,
  autoHeight: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".product-slider-pagination",
    clickable: true,
  },
  thumbs: {
    swiper: swiper,
  },
});
// product-slider js end---

// Product Slider Modal
const productModal = document.querySelector(".product-slider-modal");

document
  .querySelector(".product-slider .swiper-wrapper")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.add("active");
  });

document
  .querySelector(".product-slider-modal-close")
  ?.addEventListener("click", (e) => {
    e.stopPropagation();
    productModal?.classList.remove("active");
  });

productModal?.addEventListener("click", () => {
  productModal.classList.remove("active");
});

// Size Chart Sidebar
const sizeSidebar = document.querySelector(".size-chart-sidebar");
const sizeSidebarInner = document.querySelector(".size-chart-sidebar-inner");

const toggleSizeChart = (open, e) => {
  e?.stopPropagation();

  sizeSidebar?.classList.toggle("active", open);
  sizeSidebarInner?.classList.toggle("active", open);
  document.body.classList.toggle("active", open);
};

document
  .querySelector(".size-sidebar-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(true, e));

document
  .querySelector(".size-chart-sidebar-close-window-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

document
  .querySelector(".size-chart-close-btn")
  ?.addEventListener("click", (e) => toggleSizeChart(false, e));

// product accordion--
document.addEventListener("click", ({ target }) => {
  const btn = target.closest(".product-accordion-toggle-btn");
  if (!btn) return;

  const item = btn.closest(".product-accordion-item");
  const content = btn.nextElementSibling;
  const isOpen = item.classList.contains("active");

  document.querySelectorAll(".product-accordion-item.active").forEach((el) => {
    el.classList.remove("active");
    el.querySelector(".product-accordion-item-content").style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  }
});

// make it short, dinamic and production ready

// review-tab-section js start--
document.addEventListener("click", ({ target }) => {
  const tab = target.closest(".review-tab-nav-item");
  if (!tab) return;

  const targetId = tab.dataset.reviewTab;

  document
    .querySelectorAll(".review-tab-nav-item, .review-tab-panel")
    .forEach((el) => el.classList.toggle(
      "active",
      el === tab || el.id === targetId
    ));
});
// review-tab-section js end--

// Sticky Add to Cart
(() => {
  const stickyCart = document.querySelector(".sticky-add-to-cart-section");
  if (!stickyCart) return;

  const updateStickyCart = () => {
    stickyCart.classList.toggle("fixed", window.scrollY > 300);
  };

  updateStickyCart();
  window.addEventListener("scroll", updateStickyCart, { passive: true });
})();

// Footer dropdown responsive accordion js start --
document.addEventListener("DOMContentLoaded", () => {
  const breakpoint = window.matchMedia("(max-width: 992px)");
  const items = document.querySelectorAll(".footer-item");

  const closeItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.remove("active");
    content.style.maxHeight = "0px";
  };

  const openItem = (item) => {
    const content = item.querySelector(".footer-content");
    if (!content) return;

    item.classList.add("active");
    content.style.maxHeight = `${content.scrollHeight}px`;
  };

  const setupAccordion = () => {
    items.forEach((item) => {
      const title = item.querySelector(".footer-item-title");
      const content = item.querySelector(".footer-content");

      if (!title || !content) return;

      // Remove previous inline state
      title.onclick = null;

      if (!breakpoint.matches) {
        item.classList.remove("active");
        content.style.maxHeight = "";
        return;
      }

      // Mobile: close initially
      closeItem(item);

      title.onclick = () => {
        const isActive = item.classList.contains("active");

        // Close others
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        // Toggle current
        isActive ? closeItem(item) : openItem(item);
      };
    });
  };

  setupAccordion();

  // Handle responsive resize
  breakpoint.addEventListener("change", setupAccordion);
});
// Footer dropdown responsive accordion js end --


// membership-section js start--
(() => {
  const section = document.querySelector(".membership-section");
  const wrap = section?.querySelector(".membership-wrap");
  if (!section || !wrap) return;

  const badges = [...section.querySelectorAll(".membership-badge")];
  const parallaxEls = badges.map((badge) => badge.querySelector(".membership-parallax"));

  // Each badge drifts a different amount so the cursor effect feels layered
  // instead of every circle moving in lockstep.
  const depths = badges.map((_, i) => 10 + ((i * 37) % 22));

  badges.forEach((badge, i) => {
    badge.style.setProperty("--pop-delay", `${i * 0.06}s`);
    badge.style.setProperty("--float-delay", `${(i % 6) * 0.35}s`);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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


// scroll-reveal js start--
(() => {
  const groups = document.querySelectorAll(".reveal-group");
  if (!groups.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  const jumpTo = (y) => window.scrollTo({ top: y, left: 0, behavior: "instant" });

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
