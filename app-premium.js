document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main section[id]");
    const animatedSections = document.querySelectorAll(".section-animate");
    const serviceTabs = document.querySelectorAll(".service-tab");
    const servicePanels = document.querySelectorAll(".service-detail");
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sectionDirections = [
        "translateX(-96px)",
        "translateY(72px)",
        "translateX(96px)",
        "translateY(72px)"
    ];
    const revealDirections = [
        "translateX(-72px)",
        "translateY(56px)",
        "translateX(72px)",
        "translateY(-40px)"
    ];

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
    animatedSections.forEach((section, sectionIndex) => {
        if (!section.classList.contains("is-visible")) {
            section.style.setProperty("--section-delay", `${Math.min(sectionIndex, 4) * 45}ms`);
        }
        section.style.setProperty("--section-transform", sectionDirections[sectionIndex % sectionDirections.length]);

        section.querySelectorAll(".reveal").forEach((item, itemIndex) => {
            item.style.setProperty("--reveal-delay", `${120 + (itemIndex * 70)}ms`);
            item.style.setProperty("--reveal-transform", revealDirections[itemIndex % revealDirections.length]);
        });
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
        animatedSections.forEach((section) => section.classList.add("is-visible"));
        revealItems.forEach((item) => item.classList.add("visible"));
    } else {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -60px"
        });

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

        animatedSections.forEach((section) => {
            if (!section.classList.contains("is-visible")) {
                sectionObserver.observe(section);
            }
        });
        revealItems.forEach((item) => revealObserver.observe(item));
    }

    const tiltScene = document.querySelector("[data-tilt-scene]");
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (tiltScene && supportsHover && !reducedMotion) {
        const resetSceneTilt = () => {
            tiltScene.style.setProperty("--scene-rotate-x", "0deg");
            tiltScene.style.setProperty("--scene-rotate-y", "0deg");
            tiltScene.style.setProperty("--scene-shift-x", "0px");
            tiltScene.style.setProperty("--scene-shift-y", "0px");
            tiltScene.style.setProperty("--scene-shift-x-soft", "0px");
            tiltScene.style.setProperty("--scene-shift-y-soft", "0px");
        };

        const updateSceneTilt = (event) => {
            const bounds = tiltScene.getBoundingClientRect();
            const relativeX = (event.clientX - bounds.left) / bounds.width;
            const relativeY = (event.clientY - bounds.top) / bounds.height;
            const rotateY = (relativeX - 0.5) * 12;
            const rotateX = (0.5 - relativeY) * 10;
            const shiftX = (relativeX - 0.5) * 18;
            const shiftY = (relativeY - 0.5) * 16;

            tiltScene.style.setProperty("--scene-rotate-x", `${rotateX}deg`);
            tiltScene.style.setProperty("--scene-rotate-y", `${rotateY}deg`);
            tiltScene.style.setProperty("--scene-shift-x", `${shiftX}px`);
            tiltScene.style.setProperty("--scene-shift-y", `${shiftY}px`);
            tiltScene.style.setProperty("--scene-shift-x-soft", `${shiftX * 0.48}px`);
            tiltScene.style.setProperty("--scene-shift-y-soft", `${shiftY * 0.48}px`);
        };

        resetSceneTilt();
        tiltScene.addEventListener("pointermove", updateSceneTilt);
        tiltScene.addEventListener("pointerleave", resetSceneTilt);
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
