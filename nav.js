document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".glass-nav");
    const toggle = nav?.querySelector(".nav-toggle");
    const menu = nav?.querySelector(".nav-menu");
    const mobileBreakpoint = 768;

    if (!nav || !toggle || !menu) {
        return;
    }

    const setMenuState = (isOpen) => {
        nav.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));

        const label = isOpen ? toggle.dataset.closeLabel : toggle.dataset.openLabel;
        if (label) {
            toggle.setAttribute("aria-label", label);
        }
    };

    setMenuState(false);

    toggle.addEventListener("click", () => {
        setMenuState(!nav.classList.contains("is-open"));
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= mobileBreakpoint) {
                setMenuState(false);
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (nav.classList.contains("is-open") && !nav.contains(event.target)) {
            setMenuState(false);
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > mobileBreakpoint && nav.classList.contains("is-open")) {
            setMenuState(false);
        }
    });
});
