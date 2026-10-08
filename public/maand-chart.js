/* Interactieve maandgrafiek voor het artikel "verkoop-per-maand-op-vinted".
   Mount: <div class="mc" data-lang="nl|en"></div>. Zonder JS blijven de
   tabellen in het artikel de volledige bron van de cijfers. */
(function () {
  "use strict";

  // Afgeronde bestellingen per maand, op bestelmoment (jan t/m dec).
  var DATA = {
    2023: [2, 4, 2, 9, 10, 1, 14, 14, 6, 12, 18, 13],
    2024: [14, 16, 15, 14, 23, 14, 21, 22, 32, 15, 15, 21],
    2025: [29, 33, 54, 88, 65, 50, 42, 105, 67, 76, 27, 14],
  };
  var YEARS = ["2023", "2024", "2025"];
  var PEAK = [7, 8, 9]; // augustus, september, oktober (index)
  // Periodes: [eerste index, laatste index]
  var PERIODS = [
    { key: "jf", from: 0, to: 1 },
    { key: "mj", from: 2, to: 6 },
    { key: "ao", from: 7, to: 9, peak: true },
    { key: "nd", from: 10, to: 11 },
  ];

  var T = {
    nl: {
      locale: "nl-BE",
      long: ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"],
      short: ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"],
      tiny: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      count: "Aantal",
      share: "Aandeel van het jaar",
      shareShort: "Aandeel %",
      peakBand: "aug–okt",
      orders: "bestellingen",
      order: "bestelling",
      month: "Maand",
      ofYear: "van dat jaar",
      rank: "Plaats",
      of12: "van 12",
      periodTitle: "Gemiddeld aandeel per maand",
      periods: { jf: "Januari en februari", mj: "Maart tot en met juli", ao: "Augustus tot en met oktober", nd: "November en december" },
      noteCount: "Aantal: elk jaar heeft een eigen schaal. Kies Aandeel om de jaren eerlijk te vergelijken.",
      noteShare: "Aandeel: alle jaren staan op dezelfde schaal, dus de balken zijn rechtstreeks vergelijkbaar.",
      aria: "Afgeronde bestellingen per maand, per bestelmoment. Kies een maand voor de cijfers.",
      year: "Jaar",
      metric: "Weergave",
    },
    en: {
      locale: "en-GB",
      long: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      tiny: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
      count: "Count",
      share: "Share of the year",
      shareShort: "Share %",
      peakBand: "aug–oct",
      orders: "orders",
      order: "order",
      month: "Month",
      ofYear: "of that year",
      rank: "Rank",
      of12: "of 12",
      periodTitle: "Average share per month",
      periods: { jf: "January and February", mj: "March through July", ao: "August through October", nd: "November and December" },
      noteCount: "Count: each year has its own scale. Pick Share to compare the years fairly.",
      noteShare: "Share: all years use the same scale, so the bars compare directly.",
      aria: "Completed orders per month, by order date. Pick a month to see its figures.",
      year: "Year",
      metric: "View",
    },
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function sum(arr) {
    return arr.reduce(function (a, b) { return a + b; }, 0);
  }

  function init(root) {
    var lang = root.getAttribute("data-lang") === "en" ? "en" : "nl";
    var t = T[lang];
    var fmt1 = new Intl.NumberFormat(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    var fmt0 = new Intl.NumberFormat(t.locale);

    var state = { year: "2025", metric: "share", sel: null };

    function yearData(y) { return DATA[y]; }
    function shareOf(y, i) { return (DATA[y][i] / sum(DATA[y])) * 100; }
    function peakIndex(y) {
      var d = DATA[y];
      return d.indexOf(Math.max.apply(null, d));
    }
    state.sel = peakIndex(state.year);

    // ---------- opbouw ----------
    root.textContent = "";
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", t.aria);

    var head = el("div", "mc__head");
    var yearGroup = el("div", "mc__group");
    yearGroup.setAttribute("role", "group");
    yearGroup.setAttribute("aria-label", t.year);
    var yearBtns = YEARS.map(function (y) {
      var b = el("button", "mc__btn", y);
      b.type = "button";
      b.addEventListener("click", function () {
        state.year = y;
        state.sel = peakIndex(y);
        render(true);
      });
      yearGroup.appendChild(b);
      return b;
    });
    var metricGroup = el("div", "mc__group");
    metricGroup.setAttribute("role", "group");
    metricGroup.setAttribute("aria-label", t.metric);
    var metricBtns = [
      { k: "share", label: t.shareShort },
      { k: "count", label: t.count },
    ].map(function (m) {
      var b = el("button", "mc__btn", m.label);
      b.type = "button";
      b.addEventListener("click", function () {
        state.metric = m.k;
        render(true);
      });
      metricGroup.appendChild(b);
      return { el: b, k: m.k };
    });
    head.appendChild(yearGroup);
    head.appendChild(metricGroup);

    var plot = el("div", "mc__plot");
    var area = el("div", "mc__area");
    var grid = el("div", "mc__grid");
    var band = el("div", "mc__band");
    band.style.left = (PEAK[0] / 12) * 100 + "%";
    band.style.width = (PEAK.length / 12) * 100 + "%";
    band.appendChild(el("span", null, t.peakBand));
    grid.appendChild(band);
    var gridHalf = el("div", "mc__gridline");
    var gridTop = el("div", "mc__gridline");
    gridHalf.style.top = "50%";
    gridTop.style.top = "0";
    var gridHalfLbl = el("span");
    var gridTopLbl = el("span");
    gridHalf.appendChild(gridHalfLbl);
    gridTop.appendChild(gridTopLbl);
    grid.appendChild(gridHalf);
    grid.appendChild(gridTop);
    area.appendChild(grid);

    var cols = el("div", "mc__cols");
    var colEls = [];
    for (var i = 0; i < 12; i++) {
      (function (idx) {
        var c = el("button", "mc__col" + (PEAK.indexOf(idx) > -1 ? " mc__col--peak" : ""));
        c.type = "button";
        var v = el("span", "mc__val");
        var b = el("span", "mc__bar");
        c.appendChild(v);
        c.appendChild(b);
        c.addEventListener("click", function () { select(idx); });
        c.addEventListener("mouseenter", function () { select(idx); });
        c.addEventListener("focus", function () { select(idx); });
        c.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight") next = Math.min(11, idx + 1);
          else if (e.key === "ArrowLeft") next = Math.max(0, idx - 1);
          else if (e.key === "Home") next = 0;
          else if (e.key === "End") next = 11;
          if (next !== null) {
            e.preventDefault();
            colEls[next].el.focus();
          }
        });
        cols.appendChild(c);
        colEls.push({ el: c, val: v, bar: b });
      })(i);
    }
    area.appendChild(cols);
    plot.appendChild(area);

    var months = el("div", "mc__months");
    for (var m = 0; m < 12; m++) {
      var mm = el("span");
      mm.appendChild(el("span", "short", t.tiny[m]));
      mm.appendChild(el("span", "long", t.short[m]));
      months.appendChild(mm);
    }
    plot.appendChild(months);

    var read = el("div", "mc__read");
    read.setAttribute("aria-live", "polite");
    var rMonth = el("div");
    var rCount = el("div");
    var rRank = el("div");
    [rMonth, rCount, rRank].forEach(function (d, k) {
      d.appendChild(el("span", "mc__k", [t.month, t.orders, t.rank][k]));
      d.appendChild(el("span", "mc__v"));
      read.appendChild(d);
    });

    var periods = el("div", "mc__periods");
    periods.appendChild(el("div", "mc__ptitle", t.periodTitle));
    var pRows = PERIODS.map(function (p) {
      var row = el("div", "mc__prow" + (p.peak ? " mc__prow--peak" : ""));
      var lab = el("span", "mc__plabel", t.periods[p.key]);
      var track = el("span", "mc__ptrack");
      var fill = el("span", "mc__pfill");
      track.appendChild(fill);
      var val = el("span", "mc__pval");
      row.appendChild(lab);
      row.appendChild(track);
      row.appendChild(val);
      periods.appendChild(row);
      return { p: p, fill: fill, val: val };
    });

    var note = el("div", "mc__note");

    root.appendChild(head);
    root.appendChild(plot);
    root.appendChild(read);
    root.appendChild(periods);
    root.appendChild(note);

    // ---------- gedrag ----------
    function select(idx) {
      state.sel = idx;
      paintSelection();
    }

    function paintSelection() {
      var y = state.year;
      var d = yearData(y);
      var n = d[state.sel];
      var sorted = d.slice().sort(function (a, b) { return b - a; });
      var rank = sorted.indexOf(n) + 1;
      colEls.forEach(function (c, i) {
        c.el.setAttribute("aria-pressed", i === state.sel ? "true" : "false");
      });
      rMonth.querySelector(".mc__v").textContent = t.long[state.sel] + " " + y;
      rCount.querySelector(".mc__v").innerHTML =
        fmt0.format(n) + " <small>" + fmt1.format(shareOf(y, state.sel)) + " % " + t.ofYear + "</small>";
      rRank.querySelector(".mc__v").innerHTML = rank + " <small>" + t.of12 + "</small>";
    }

    function render() {
      var y = state.year;
      var d = yearData(y);
      var isShare = state.metric === "share";

      yearBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", YEARS[i] === y ? "true" : "false"); });
      metricBtns.forEach(function (m) { m.el.setAttribute("aria-pressed", m.k === state.metric ? "true" : "false"); });

      var max;
      if (isShare) {
        max = 18; // vaste schaal voor alle jaren
      } else {
        var top = Math.max.apply(null, d);
        max = top <= 40 ? Math.ceil(top / 10) * 10 : Math.ceil(top / 20) * 20;
      }
      gridTopLbl.textContent = isShare ? max + "%" : String(max);
      gridHalfLbl.textContent = isShare ? max / 2 + "%" : String(max / 2);

      d.forEach(function (n, i) {
        var value = isShare ? shareOf(y, i) : n;
        colEls[i].bar.style.height = (value / max) * (100 - 8) + "%";
        colEls[i].val.textContent = isShare ? fmt1.format(value) : String(n);
        var label = t.long[i] + " " + y + ": " + n + " " + (n === 1 ? t.order : t.orders) + ", " + fmt1.format(shareOf(y, i)) + " % " + t.ofYear;
        colEls[i].el.setAttribute("aria-label", label);
      });

      var total = sum(d);
      pRows.forEach(function (r) {
        var count = r.p.to - r.p.from + 1;
        var avg = (sum(d.slice(r.p.from, r.p.to + 1)) / total) * 100 / count;
        r.fill.style.width = (avg / 16) * 100 + "%";
        r.val.textContent = fmt1.format(avg) + "%";
      });

      note.textContent = isShare ? t.noteShare : t.noteCount;
      paintSelection();
    }

    render();
  }

  function boot() {
    var roots = document.querySelectorAll(".mc[data-lang]");
    for (var i = 0; i < roots.length; i++) init(roots[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
