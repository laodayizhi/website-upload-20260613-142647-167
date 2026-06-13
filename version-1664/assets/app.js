(function () {
    const menuButton = document.querySelector("[data-menu-toggle]");
    const mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    const slides = Array.from(document.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    const thumbs = Array.from(document.querySelectorAll("[data-hero-thumb]"));
    const copies = Array.from(document.querySelectorAll("[data-hero-copy]"));
    let currentSlide = 0;
    let slideTimer = null;

    function activateSlide(index) {
        if (!slides.length) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === currentSlide);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === currentSlide);
        });

        thumbs.forEach(function (thumb, thumbIndex) {
            thumb.classList.toggle("is-active", thumbIndex === currentSlide);
        });

        copies.forEach(function (copy, copyIndex) {
            copy.classList.toggle("is-active", copyIndex === currentSlide);
        });
    }

    function startHero() {
        if (!slides.length) {
            return;
        }

        window.clearInterval(slideTimer);
        slideTimer = window.setInterval(function () {
            activateSlide(currentSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            activateSlide(index);
            startHero();
        });
    });

    thumbs.forEach(function (thumb, index) {
        thumb.addEventListener("click", function () {
            activateSlide(index);
            startHero();
        });
    });

    activateSlide(0);
    startHero();

    const searchAreas = Array.from(document.querySelectorAll("[data-search-area]"));

    searchAreas.forEach(function (area) {
        const input = area.querySelector("[data-search-input]");
        const yearSelect = area.querySelector("[data-year-filter]");
        const typeSelect = area.querySelector("[data-type-filter]");
        const cards = Array.from(area.querySelectorAll("[data-movie-card]"));
        const empty = area.querySelector("[data-empty-state]");

        function applyFilters() {
            const query = input ? input.value.trim().toLowerCase() : "";
            const year = yearSelect ? yearSelect.value : "";
            const type = typeSelect ? typeSelect.value : "";
            let visible = 0;

            cards.forEach(function (card) {
                const haystack = (card.getAttribute("data-title") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-region")).toLowerCase();
                const cardYear = card.getAttribute("data-year");
                const cardType = card.getAttribute("data-type");
                const okQuery = !query || haystack.indexOf(query) !== -1;
                const okYear = !year || cardYear === year;
                const okType = !type || cardType === type;
                const show = okQuery && okYear && okType;

                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }

        if (yearSelect) {
            yearSelect.addEventListener("change", applyFilters);
        }

        if (typeSelect) {
            typeSelect.addEventListener("change", applyFilters);
        }
    });
})();
