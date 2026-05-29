// Investing Memo v4 — Mangoboard-tone light dashboard
// 가벼운 인터랙션: 카드 진입 애니메이션 + 활성 네비

(function() {
  // 부드러운 진입 애니메이션 (IntersectionObserver)
  if (typeof IntersectionObserver === "undefined") return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  document.addEventListener("DOMContentLoaded", () => {
    // 등장 애니메이션 대상
    const animTargets = document.querySelectorAll(".sector-card, .stat-card, .headline, .stripe");
    animTargets.forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
      observer.observe(el);
    });

    // 현재 페이지 nav active
    const path = location.pathname.replace(/\/$/, "");
    document.querySelectorAll(".nav-links a").forEach(a => {
      const href = a.getAttribute("href").replace(/\/$/, "");
      if (path.endsWith(href) || (href === "./index.html" && (path === "" || path.endsWith("/index.html")))) {
        a.classList.add("active");
      }
    });
  });
})();
