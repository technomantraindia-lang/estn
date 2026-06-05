document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const serviceTabs = document.querySelectorAll(".service-tab");
    const servicePanels = document.querySelectorAll(".service-detail");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const closeMenu = () => {
        menuToggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        header.classList.remove("menu-active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
    };

    menuToggle.addEventListener("click", () => {
        const willOpen = !mobileMenu.classList.contains("open");
        menuToggle.classList.toggle("open", willOpen);
        mobileMenu.classList.toggle("open", willOpen);
        header.classList.toggle("menu-active", willOpen);
        document.body.classList.toggle("menu-open", willOpen);
        menuToggle.setAttribute("aria-expanded", String(willOpen));
        menuToggle.setAttribute("aria-label", willOpen ? "Close menu" : "Open menu");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 30);

        let currentSection = "home";
        sections.forEach((section) => {
            if (window.scrollY >= section.offsetTop - 180) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${currentSection}`);
        });
    };

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    serviceTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const serviceName = tab.dataset.service;

            serviceTabs.forEach((item) => {
                const isActive = item === tab;
                item.classList.toggle("active", isActive);
                item.setAttribute("aria-selected", String(isActive));
            });

            servicePanels.forEach((panel) => {
                panel.classList.toggle("active", panel.dataset.panel === serviceName);
            });
        });
    });

    const revealItems = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -45px"
        });

        revealItems.forEach((item) => revealObserver.observe(item));
    }

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalLabel = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = "Inquiry received <i class=\"fa-solid fa-check\"></i>";
        formStatus.textContent = "Thank you. Our engineering team will contact you shortly.";
        contactForm.reset();

        window.setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalLabel;
        }, 3500);
    });

    document.getElementById("current-year").textContent = new Date().getFullYear();
});
