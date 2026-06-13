(function () {
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
      mobileToggle.textContent = mobileNav.classList.contains('is-open') ? '×' : '☰';
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var query = input ? input.value.trim() : '';
      var target = './search.html';

      if (query) {
        target += '?q=' + encodeURIComponent(query);
      }

      window.location.href = target;
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  var pageSearch = document.querySelector('[data-page-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .ranking-row'));

  function textOf(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-region') || '',
      card.getAttribute('data-type') || '',
      card.getAttribute('data-year') || '',
      card.getAttribute('data-tags') || ''
    ].join(' ').toLowerCase();
  }

  function applyFilters(value) {
    var query = pageSearch ? pageSearch.value.trim().toLowerCase() : '';
    var activeValue = value || 'all';

    cards.forEach(function (card) {
      var cardText = textOf(card);
      var matchesQuery = !query || cardText.indexOf(query) !== -1;
      var matchesFilter = activeValue === 'all' || cardText.indexOf(String(activeValue).toLowerCase()) !== -1;
      card.classList.toggle('is-hidden', !(matchesQuery && matchesFilter));
    });
  }

  if (filterPanel && cards.length) {
    var buttons = Array.prototype.slice.call(filterPanel.querySelectorAll('[data-filter-value]'));
    var active = 'all';

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        active = button.getAttribute('data-filter-value') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        applyFilters(active);
      });
    });

    if (pageSearch) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get('q');

      if (query) {
        pageSearch.value = query;
      }

      pageSearch.addEventListener('input', function () {
        applyFilters(active);
      });
    }

    applyFilters(active);
  }
})();
