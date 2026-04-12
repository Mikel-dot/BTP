function initNavigation() {
    const nav = document.querySelector(".glass-nav");
    const mobileBreakpoint = 768;

    if (!nav || nav.dataset.navReady === "true") {
        return;
    }

    const toggle = nav.querySelector(".nav-toggle");
    const menu = nav.querySelector(".nav-menu");

    if (!toggle || !menu) {
        return;
    }

    nav.dataset.navReady = "true";

    const setMenuState = (isOpen) => {
        nav.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));

        const label = isOpen ? toggle.getAttribute("data-close-label") : toggle.getAttribute("data-open-label");
        if (label) {
            toggle.setAttribute("aria-label", label);
        }
    };

    setMenuState(false);

    toggle.addEventListener("click", function () {
        setMenuState(!nav.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.innerWidth <= mobileBreakpoint) {
                setMenuState(false);
            }
        });
    });

    document.addEventListener("click", function (event) {
        if (nav.classList.contains("is-open") && !nav.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > mobileBreakpoint && nav.classList.contains("is-open")) {
            setMenuState(false);
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
} else {
    initNavigation();
}
