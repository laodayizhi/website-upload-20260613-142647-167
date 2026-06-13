(function () {
    function selectAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-button]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', slider);
        var dots = selectAll('[data-hero-dot]', slider);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function activate(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('is-active', position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('is-active', position === index);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, position) {
            dot.addEventListener('click', function () {
                activate(position);
                start();
            });
        });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        activate(0);
        start();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function initFilters() {
        var grids = selectAll('[data-movie-grid]');
        if (!grids.length) {
            return;
        }
        var searchInput = document.querySelector('[data-search-input]');
        var yearSelect = document.querySelector('[data-filter-year]');
        var typeSelect = document.querySelector('[data-filter-type]');
        var categorySelect = document.querySelector('[data-filter-category]');
        function apply() {
            var query = normalize(searchInput && searchInput.value);
            var year = normalize(yearSelect && yearSelect.value);
            var type = normalize(typeSelect && typeSelect.value);
            var category = normalize(categorySelect && categorySelect.value);
            grids.forEach(function (grid) {
                selectAll('.movie-card', grid).forEach(function (card) {
                    var text = normalize([
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.tags,
                        card.dataset.year
                    ].join(' '));
                    var matchQuery = !query || text.indexOf(query) !== -1;
                    var matchYear = !year || normalize(card.dataset.year) === year;
                    var matchType = !type || normalize(card.dataset.type).indexOf(type) !== -1;
                    var matchCategory = !category || normalize(card.dataset.category) === category;
                    card.classList.toggle('is-hidden', !(matchQuery && matchYear && matchType && matchCategory));
                });
            });
        }
        [searchInput, yearSelect, typeSelect, categorySelect].forEach(function (control) {
            if (!control) {
                return;
            }
            control.addEventListener('input', apply);
            control.addEventListener('change', apply);
        });
        apply();
    }

    function initBackTop() {
        var button = document.querySelector('[data-back-top]');
        if (!button) {
            return;
        }
        function toggle() {
            button.classList.toggle('is-visible', window.scrollY > 520);
        }
        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        window.addEventListener('scroll', toggle, { passive: true });
        toggle();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initFilters();
        initBackTop();
    });
}());
