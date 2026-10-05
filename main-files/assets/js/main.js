document.addEventListener("DOMContentLoaded", () => {
    // If coming from another page with a hash, reset scroll to top immediately 
    // so that GSAP ScrollTrigger animations don't get stuck hidden.
    if (window.location.hash) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Initialize Lenis for Smooth Page Scrolling
    if (typeof Lenis !== 'undefined') {
      window.lenis = new Lenis();
      function raf(time) {
        window.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // ScrollSpy for Navigation Links
    const navLinks = document.querySelectorAll('.nav-scroll-link');
    const sections = Array.from(navLinks).map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        try {
          return document.querySelector(href);
        } catch (e) {}
      }
      return null;
    }).filter(Boolean);

    if (sections.length > 0) {
      const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(link => {
              link.classList.remove('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
              link.classList.add('hover:text-indigo-600', 'dark:hover:text-white');
            });
            const activeLink = document.querySelector(`.nav-scroll-link[href="#${entry.target.id}"]`);
            if (activeLink) {
              activeLink.classList.remove('hover:text-indigo-600', 'dark:hover:text-white');
              activeLink.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-semibold');
            }
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('data-lucide', 'menu');
          } else {
            icon.setAttribute('data-lucide', 'x');
          }
          lucide.createIcons();
        }
      });

      // Hide mobile menu when any link inside it is clicked
      const mobileLinks = mobileMenu.querySelectorAll('a');
      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('flex');
          const icon = mobileMenuBtn.querySelector('i');
          if (icon) {
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
          }
        });
      });
    }

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', function() {
        if (document.documentElement.classList.contains('dark')) {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    }

    // Billing Toggle Switcher Script
    const billingToggle = document.getElementById('billing-toggle');
    const toggleThumb = document.getElementById('billing-toggle-thumb');
    const priceValues = document.querySelectorAll('.price-value');
    let isYearly = false;

    if (billingToggle) {
      billingToggle.addEventListener('click', () => {
        isYearly = !isYearly;
        billingToggle.setAttribute('aria-checked', isYearly);

        if (isYearly) {
          toggleThumb.classList.replace('translate-x-0', 'translate-x-7');
          priceValues.forEach(el => el.textContent = el.getAttribute('data-yearly'));
        } else {
          toggleThumb.classList.replace('translate-x-7', 'translate-x-0');
          priceValues.forEach(el => el.textContent = el.getAttribute('data-monthly'));
        }
      });
    }

    // Testimonial Slider Script
    const testimonials = [
      {
        name: "Sophia Lloyd",
        role: "CEO, XIO",
        quote: "Excellent work guys. Redesign of the application really help me grow my business and revenue. I would like to work again with you in future sometime.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
      },
      {
        name: "Alex Chen",
        role: "CTO at Nexus",
        quote: "Flowora transformed how we automate our data pipelines. The visual builder combined with powerful AI agents saved us hundreds of engineering hours.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      {
        name: "Sarah Reynolds",
        role: "Head of Ops at Globex",
        quote: "We deployed our first agent in under 10 minutes. It's incredibly intuitive, yet powerful enough to handle our complex multi-step enterprise workflows.",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
      },
      {
        name: "David Kim",
        role: "Lead Engineer at CyberTech",
        quote: "The best workflow automation platform we've used. The security compliance gives us peace of mind, and the real-time analytics are game-changing.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
      },
      {
        name: "Marcus Johnson",
        role: "Product Manager",
        quote: "I've tried many tools, but the simplicity and power of this platform is unmatched. Our team productivity skyrocketed in just weeks.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      }
    ];

    let currentSlide = 0;
    const totalSlides = testimonials.length;

    const domActiveImg = document.getElementById('ts-active-img');
    const domLeft1 = document.getElementById('ts-left-1-img');
    const domLeft2 = document.getElementById('ts-left-2-img');
    const domRight1 = document.getElementById('ts-right-1-img');
    const domRight2 = document.getElementById('ts-right-2-img');
    const domName = document.getElementById('ts-name');
    const domRole = document.getElementById('ts-role');
    const domQuote = document.getElementById('ts-quote');
    const domCurrentNum = document.getElementById('ts-current');
    const domTotalNum = document.getElementById('ts-total');
    const contentContainer = document.getElementById('ts-content-container');

    if (domActiveImg) {
      domTotalNum.textContent = totalSlides;
      
      const getIndex = (offset) => {
        return (currentSlide + offset + totalSlides) % totalSlides;
      };

      const updateSlider = () => {
        // Fade out
        contentContainer.style.opacity = '0';
        
        setTimeout(() => {
          // Update data
          const active = testimonials[currentSlide];
          domName.textContent = active.name;
          domRole.textContent = active.role;
          domQuote.textContent = active.quote;
          domCurrentNum.textContent = currentSlide + 1;

          // Update images
          domActiveImg.src = active.img;
          domLeft1.src = testimonials[getIndex(-1)].img;
          domLeft2.src = testimonials[getIndex(-2)].img;
          domRight1.src = testimonials[getIndex(1)].img;
          domRight2.src = testimonials[getIndex(2)].img;

          // Fade in
          contentContainer.style.opacity = '1';
        }, 300);
      };

      const prevBtn = document.getElementById('ts-prev');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateSlider();
        });
      }

      const nextBtn = document.getElementById('ts-next');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateSlider();
        });
      }
      
      // Initialize
      updateSlider();
    }
    // AJAX Contact Form Handler
    const form = document.getElementById('contact-form');
    const formResponse = document.getElementById('form-response');

    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        formResponse.classList.add('hidden');
        formResponse.className = 'hidden p-4 rounded-xl text-xs font-medium border mt-6';
        
        const formData = new FormData(form);

        try {
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          const result = await response.json();

          if (result.status === 'success') {
            formResponse.classList.remove('hidden');
            formResponse.classList.add('bg-emerald-50', 'dark:bg-emerald-950/50', 'text-emerald-700', 'dark:text-emerald-300', 'border-emerald-200', 'dark:border-emerald-800');
            formResponse.textContent = result.message;
            form.reset();
          } else {
            throw new Error(result.message || 'Something went wrong.');
          }
        } catch (err) {
          formResponse.classList.remove('hidden');
          formResponse.classList.add('bg-red-50', 'dark:bg-red-950/50', 'text-red-700', 'dark:text-red-300', 'border-red-200', 'dark:border-red-800');
          formResponse.textContent = err.message || 'Failed to send message. Please check PHP mail server configuration.';
        }
      });
    }

    // 1. GSAP Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // GSAP Smooth Scroll with offset for sticky header
          if (window.lenis) {
            window.lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
          } else {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: { y: targetElement, offsetY: 70 },
              ease: "power2.out"
            });
          }
          
          // Close mobile menu if open
          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            const btnIcon = document.querySelector('#mobile-menu-btn i');
            if (btnIcon) {
              btnIcon.setAttribute('data-lucide', 'menu');
              lucide.createIcons();
            }
          }
        }
      });
    });

    // 1.5 Handle hash in URL on page load (e.g. coming from 404.html)
    if (window.location.hash) {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        // Use a slight delay to override browser's default jump
        setTimeout(() => {
          // Scroll smoothly to target with header offset
          if (window.lenis) {
            window.lenis.scrollTo(targetElement, { offset: -70, duration: 1.2 });
          } else {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: { y: targetElement, offsetY: 70 },
              ease: "power2.out"
            });
          }
          // Remove hash from URL to keep it clean
          history.replaceState(null, null, window.location.pathname + window.location.search);
        }, 150);
      }
    }


    // 2. Hero Section Entrance Animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });
    
    tl.from("#hero-badge", { y: 20, opacity: 0, delay: 0.1 })
      .from(".hero-word", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
      .from("#hero-subheading", { y: 20, opacity: 0 }, "-=0.4")
      .from("#hero-ctas", { y: 20, opacity: 0 }, "-=0.6")
      .from("#hero-checks", { y: 20, opacity: 0 }, "-=0.6")
      .from("#hero-image", { x: 50, opacity: 0, duration: 1.2, ease: "power4.out" }, 0.1);

      // 3. Generic Fade-Up Scroll Animation
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      const fadeUpElements = gsap.utils.toArray('.gsap-fade-up');
      fadeUpElements.forEach(elem => {
        gsap.from(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 85%", // trigger when element hits 85% down the viewport
            toggleActions: "play none none none"
          },
          y: 30, 
          opacity: 0, 
          duration: 0.6, 
          ease: "power3.out"
        });
      });

      // 4. Generic Typing Heading Scroll Animation
      const typingHeadings = gsap.utils.toArray('.gsap-typing-heading');
      typingHeadings.forEach(heading => {
        const words = heading.textContent.trim().split(/\s+/);
        heading.innerHTML = '';
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.className = 'inline-block typing-word';
          span.innerText = word;
          heading.appendChild(span);
          if (index < words.length - 1) {
            heading.appendChild(document.createTextNode(' '));
          }
        });

        gsap.from(heading.querySelectorAll('.typing-word'), {
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out"
        });
      });

      // 4. Trusted Section Scroll Animation
      const trustedTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#trusted-section",
          start: "top 85%",
        }
      });
      trustedTl.from("#trusted-heading", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" })
               .from(".trusted-logo", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.2")
               .from("#trusted-subtitle", { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");

      // 5. Feature Boxes Directional Scroll Animation
      const featureLeft = gsap.utils.toArray('.gsap-feature-left');
      featureLeft.forEach(elem => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
          x: -50, opacity: 0, duration: 0.6, ease: "power3.out"
        });
      });

      const featureCenter = gsap.utils.toArray('.gsap-feature-center');
      featureCenter.forEach(elem => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
          y: 50, opacity: 0, duration: 0.6, ease: "power3.out"
        });
      });

      const featureRight = gsap.utils.toArray('.gsap-feature-right');
      featureRight.forEach(elem => {
        gsap.from(elem, {
          scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none none" },
          x: 50, opacity: 0, duration: 0.6, ease: "power3.out"
        });
      });
    }

  // 10. Dynamic Blog Rendering
  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid && window.blogData) {
    let blogHtml = '';
    const animClasses = ['gsap-feature-left', 'gsap-feature-center', 'gsap-feature-right'];
    
    window.blogData.forEach((blog, index) => {
      const animClass = animClasses[index % 3];
      
      blogHtml += `
        <!-- Article -->
        <article class="${animClass} bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-shadow duration-300 flex flex-col group border border-slate-100 dark:border-slate-800">
          <div class="h-56 w-full overflow-hidden relative">
            <img src="${blog.image}" alt="${blog.category}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-6 sm:p-8 flex flex-col flex-grow bg-white dark:bg-slate-900">
            <div class="text-slate-500 dark:text-slate-400 font-bold text-[12px] mb-3 flex items-center gap-2 uppercase tracking-wide">
              <span>${blog.category}</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight transition-colors">
              <a href="blog-detail.html?id=${blog.id}" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">${blog.title}</a>
            </h3>
            <p class="text-slate-500 dark:text-slate-400 text-[15px] mb-8 flex-grow leading-relaxed line-clamp-3">
              ${blog.excerpt}
            </p>
            <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-4 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span>${blog.date}</span> <span class="text-slate-300 dark:text-slate-700">&bull;</span> <span>${blog.readTime}</span>
              </div>
              <a href="blog-detail.html?id=${blog.id}" class="text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1 capitalize normal-case text-sm">Read More &rarr;</a>
            </div>
          </div>
        </article>
      `;
    });
    
    blogGrid.innerHTML = blogHtml;
    
    // Refresh ScrollTrigger after injecting new DOM elements so animations work correctly
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }
});