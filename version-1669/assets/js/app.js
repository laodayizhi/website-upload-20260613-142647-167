(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function escapeText(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    if (slides.length < 2) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(idx);
        start();
      });
    });

    start();
  }

  function setupPageFilter() {
    var input = document.querySelector(".page-filter input");
    var grid = document.querySelector("[data-filter-grid]");
    if (!input || !grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        card.style.display = !q || haystack.indexOf(q) !== -1 ? "" : "none";
      });
    });
  }

  function cardTemplate(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeText(tag) + "</span>";
    }).join("");
    return [
      "<article class=\"movie-card\" data-title=\"" + escapeText(item.title) + "\" data-tags=\"" + escapeText((item.tags || []).join(" ")) + "\" data-year=\"" + escapeText(item.year) + "\" data-region=\"" + escapeText(item.region) + "\">",
      "<a href=\"" + escapeText(item.href) + "\" class=\"poster-link\" aria-label=\"观看" + escapeText(item.title) + "\">",
      "<img src=\"" + escapeText(item.cover) + "\" alt=\"" + escapeText(item.title) + "\" loading=\"lazy\">",
      "<span class=\"poster-shade\"></span>",
      "<span class=\"play-mark\">▶</span>",
      "<span class=\"year-badge\">" + escapeText(item.year) + "</span>",
      "</a>",
      "<div class=\"card-body\">",
      "<h3><a href=\"" + escapeText(item.href) + "\">" + escapeText(item.title) + "</a></h3>",
      "<p>" + escapeText(item.oneLine) + "</p>",
      "<div class=\"card-meta\"><span>" + escapeText(item.region) + "</span><span>" + escapeText(item.type) + "</span></div>",
      "<div class=\"tag-list\">" + tags + "</div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function setupSearch() {
    var data = window.SiteSearchData;
    var form = document.querySelector(".search-panel");
    var input = document.getElementById("site-search-input");
    var grid = document.getElementById("search-results");
    var status = document.getElementById("search-status");
    if (!data || !form || !input || !grid || !status) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;

    function render(query) {
      var q = query.trim().toLowerCase();
      var items = data.filter(function (item) {
        if (!q) {
          return true;
        }
        return item.search.indexOf(q) !== -1;
      }).slice(0, 120);
      grid.innerHTML = items.map(cardTemplate).join("");
      status.textContent = q ? "搜索结果" : "热门推荐";
      if (items.length === 0) {
        grid.innerHTML = "<div class=\"empty-state\">暂未找到匹配影片</div>";
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      render(input.value);
      var url = new URL(window.location.href);
      if (input.value.trim()) {
        url.searchParams.set("q", input.value.trim());
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState(null, "", url.toString());
    });

    input.addEventListener("input", function () {
      render(input.value);
    });

    render(initial);
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupPageFilter();
    setupSearch();
  });
}());
