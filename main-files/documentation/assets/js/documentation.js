document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Mobile sidebar toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sidebar = document.getElementById("docs-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("-translate-x-full");
      if(sidebarOverlay) sidebarOverlay.classList.toggle("hidden");
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.add("-translate-x-full");
      sidebarOverlay.classList.add("hidden");
    });
  }

  // Active state highlighting on scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current) && current !== "") {
        link.classList.add("active");
      }
    });
  });

  // Back to top button
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove("hide");
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
        backToTopBtn.classList.add("hide");
      }
    });

    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Simple Theme Toggle (if implemented in docs)
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
    });
  }

  // Sticky Purchase Bar Controller
  const purchaseBar = document.getElementById('sticky-purchase-bar');
  const dismissBtn = document.getElementById('dismiss-purchase-bar');
  const reopenBtn = document.getElementById('reopen-purchase-bar');

  if (purchaseBar && dismissBtn) {
    if (sessionStorage.getItem('flowora_purchase_bar_closed') === 'true') {
      purchaseBar.classList.add('hidden');
      if (reopenBtn) {
        reopenBtn.classList.remove('hidden');
        reopenBtn.classList.add('inline-flex');
      }
    }

    dismissBtn.addEventListener('click', () => {
      purchaseBar.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => {
        purchaseBar.classList.add('hidden');
        if (reopenBtn) {
          reopenBtn.classList.remove('hidden');
          reopenBtn.classList.add('inline-flex');
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }, 300);
      sessionStorage.setItem('flowora_purchase_bar_closed', 'true');
    });

    if (reopenBtn) {
      reopenBtn.addEventListener('click', () => {
        reopenBtn.classList.add('hidden');
        reopenBtn.classList.remove('inline-flex');
        purchaseBar.classList.remove('hidden');
        requestAnimationFrame(() => {
          purchaseBar.classList.remove('opacity-0', 'translate-y-4');
        });
        sessionStorage.removeItem('flowora_purchase_bar_closed');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      });
    }
  }
});
