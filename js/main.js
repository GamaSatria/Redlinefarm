/* =========================================================
   KONFIGURASI — GANTI DI SINI SAJA
   ========================================================= */
const CONFIG = {
  // Nomor WhatsApp format internasional, tanpa "+" / spasi / tanda hubung
  whatsapp: "6281234567890",
  // Link akun sosial media
  social: {
    youtube:   "https://www.youtube.com/@redlinefarm",
    tiktok:    "https://www.tiktok.com/@redlinefarm",
    instagram: "https://www.instagram.com/redlinefarm",
    facebook:  "https://www.facebook.com/redlinefarm",
  },
};

/* ---------- Link WhatsApp & sosial media ---------- */
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(el.dataset.wa)}`;
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-social]").forEach((el) => {
  const url = CONFIG.social[el.dataset.social];
  if (url) el.href = url;
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Header & menu mobile ---------- */
const header = document.querySelector(".header");
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

burger.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", open);
  document.body.classList.toggle("no-scroll", open);
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  })
);

/* ---------- Animasi muncul saat di-scroll ---------- */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ---------- Hitung angka statistik ---------- */
const counters = document.querySelectorAll("[data-count]");
const runCount = (el) => {
  const target = +el.dataset.count;
  const suffix = target >= 100 ? "+" : "";
  if (reduceMotion) { el.textContent = target.toLocaleString("id-ID") + suffix; return; }
  const start = performance.now(), dur = 1400;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased).toLocaleString("id-ID") + (p === 1 ? suffix : "");
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
if ("IntersectionObserver" in window) {
  const co = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); }
  }), { threshold: 0.5 });
  counters.forEach((c) => co.observe(c));
} else counters.forEach(runCount);

/* ---------- Tab jenis ayam ---------- */
const breeds = document.getElementById("breeds");
if (breeds) {
  const tabs = [...breeds.querySelectorAll('[role="tab"]')];
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  };
  breeds.classList.add("is-tabbed");
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      select(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });
  select(tabs[0]);
}

/* ---------- Lightbox galeri ---------- */
const lb = document.getElementById("lightbox");
const lbImg = lb.querySelector("img");
document.querySelectorAll(".gallery__item").forEach((btn) =>
  btn.addEventListener("click", () => {
    const img = btn.querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lb.hidden = false;
    lb.querySelector("button").focus();
  })
);
const closeLb = () => { lb.hidden = true; lbImg.removeAttribute("src"); };
lb.addEventListener("click", (e) => { if (e.target !== lbImg) closeLb(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) closeLb(); });
