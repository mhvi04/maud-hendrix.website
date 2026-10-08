/* Twee kleine interactieve visuals voor "terugkerende-kopers-op-vinted".
   Mounts: <div class="kc" data-kind="dots|time" data-lang="nl|en"></div>.
   Zonder JS blijven de tabellen in het artikel de bron van de cijfers. */
(function () {
  "use strict";

  // Aantal kopers per aantal bestellingen (mei 2022 tot en met maart 2026).
  var GROUPS = [
    { key: "1", times: 1, buyers: 994 },
    { key: "2", times: 2, buyers: 18 },
    { key: "3", times: 3, buyers: 1 },
    { key: "4", times: 4, buyers: 1 },
  ];
  var TOTAL_BUYERS = 1014;
  var TOTAL_ORDERS = 1037;
  // Tijd tussen eerste en tweede bestelling.
  var TIME = [3, 8, 5, 4];

  var T = {
    nl: {
      locale: "nl-BE",
      dotsTitle: "Elk vierkantje is één koper",
      btn: { ret: "Terugkomers", "1": "1 keer", "2": "2 keer", "3": "3 keer", "4": "4 keer" },
      kBuyers: "Kopers",
      kShareBuyers: "Aandeel kopers",
      kShareOrders: "Aandeel bestellingen",
      orders: "bestellingen",
      ofBuyers: "van de kopers",
      ofOrders: "van de bestellingen",
      groupLabel: { ret: "Meer dan één bestelling", "1": "Eén bestelling", "2": "Twee bestellingen", "3": "Drie bestellingen", "4": "Vier bestellingen" },
      dotsNote: "Gesorteerd van één bestelling naar vier. Het aandeel bestellingen is berekend uit de tabel hierboven: aantal kopers maal aantal bestellingen, gedeeld door 1.037.",
      dotsAria: "Raster van 1.014 kopers. Kies een groep om die te markeren.",
      timeTitle: "Tijd tussen eerste en tweede bestelling",
      view: { group: "Per groep", cum: "Opgeteld" },
      rows: ["Dezelfde dag", "1 tot en met 30 dagen", "31 tot en met 90 dagen", "Meer dan 90 dagen"],
      cumRows: ["Dezelfde dag", "Binnen 30 dagen", "Binnen 90 dagen", "Alle terugkomers"],
      timeKBuyers: "Kopers",
      timeKShare: "Van de 20 terugkomers",
      timeKMed: "Mediaan",
      days: "dagen",
      timeNote: "Mediaan 19 dagen, langste tussentijd 234 dagen. Opgeteld laat zien hoeveel terugkomers uiterlijk binnen die termijn opnieuw bestelden.",
      timeAria: "Tijd tussen de eerste en tweede bestelling van de 20 terugkerende kopers",
    },
    en: {
      locale: "en-GB",
      dotsTitle: "Each square is one buyer",
      btn: { ret: "Returning", "1": "1 order", "2": "2 orders", "3": "3 orders", "4": "4 orders" },
      kBuyers: "Buyers",
      kShareBuyers: "Share of buyers",
      kShareOrders: "Share of orders",
      orders: "orders",
      ofBuyers: "of buyers",
      ofOrders: "of orders",
      groupLabel: { ret: "More than one order", "1": "One order", "2": "Two orders", "3": "Three orders", "4": "Four orders" },
      dotsNote: "Sorted from one order to four. The share of orders is calculated from the table above: number of buyers times number of orders, divided by 1,037.",
      dotsAria: "Grid of 1,014 buyers. Pick a group to highlight it.",
      timeTitle: "Time between first and second order",
      view: { group: "Per group", cum: "Cumulative" },
      rows: ["Same day", "1 to 30 days", "31 to 90 days", "More than 90 days"],
      cumRows: ["Same day", "Within 30 days", "Within 90 days", "All returning buyers"],
      timeKBuyers: "Buyers",
      timeKShare: "Of the 20 returning buyers",
      timeKMed: "Median",
      days: "days",
      timeNote: "Median 19 days, longest gap 234 days. Cumulative shows how many returning buyers ordered again within that time at the latest.",
      timeAria: "Time between first and second order for the 20 returning buyers",
    },
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function readout(parent, labels) {
    var read = el("div", "kc__read");
    read.setAttribute("aria-live", "polite");
    var vals = labels.map(function (l) {
      var d = el("div");
      d.appendChild(el("span", "kc__k", l));
      var v = el("span", "kc__v");
      d.appendChild(v);
      read.appendChild(d);
      return v;
    });
    parent.appendChild(read);
    return vals;
  }

  // ---------- puntenraster ----------
  function dots(root, t) {
    var f1 = new Intl.NumberFormat(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    var f0 = new Intl.NumberFormat(t.locale);
    var state = "ret";

    root.setAttribute("role", "group");
    root.setAttribute("aria-label", t.dotsAria);

    var head = el("div", "kc__head");
    head.appendChild(el("div", "kc__title", t.dotsTitle));
    var btns = el("div", "kc__btns");
    var order = ["ret", "1", "2", "3", "4"];
    var btnEls = order.map(function (k) {
      var b = el("button", "mc__btn", t.btn[k]);
      b.type = "button";
      b.addEventListener("click", function () { state = k; paint(); });
      btns.appendChild(b);
      return b;
    });
    head.appendChild(btns);
    root.appendChild(head);

    var grid = el("div", "kc__dots");
    grid.setAttribute("aria-hidden", "true");
    var cells = [];
    var groupOf = [];
    GROUPS.forEach(function (g) {
      for (var i = 0; i < g.buyers; i++) groupOf.push(g.times);
    });
    for (var i = 0; i < TOTAL_BUYERS; i++) {
      var c = el("span", "kc__dot");
      grid.appendChild(c);
      cells.push(c);
    }
    root.appendChild(grid);

    var vals = readout(root, [t.kBuyers, t.kShareBuyers, t.kShareOrders]);
    var note = el("div", "kc__note", t.dotsNote);
    root.appendChild(note);

    function paint() {
      var buyers = 0;
      var ordersN = 0;
      cells.forEach(function (c, i) {
        var n = groupOf[i];
        var on = state === "ret" ? n > 1 : n === Number(state);
        c.className = "kc__dot" + (on ? " kc__dot--on" : "");
      });
      GROUPS.forEach(function (g) {
        var on = state === "ret" ? g.times > 1 : g.times === Number(state);
        if (on) {
          buyers += g.buyers;
          ordersN += g.buyers * g.times;
        }
      });
      btnEls.forEach(function (b, i) { b.setAttribute("aria-pressed", order[i] === state ? "true" : "false"); });
      vals[0].innerHTML = f0.format(buyers) + " <small>" + t.groupLabel[state].toLowerCase() + "</small>";
      vals[1].innerHTML = f1.format((buyers / TOTAL_BUYERS) * 100) + " % <small>" + t.ofBuyers + "</small>";
      vals[2].innerHTML = f1.format((ordersN / TOTAL_ORDERS) * 100) + " % <small>" + f0.format(ordersN) + " " + t.orders + "</small>";
    }
    paint();
  }

  // ---------- tijdsgrafiek ----------
  function time(root, t) {
    var f0 = new Intl.NumberFormat(t.locale);
    var view = "group";
    var sel = 1;
    var cum = [];
    TIME.reduce(function (a, n, i) { cum[i] = a + n; return cum[i]; }, 0);

    root.setAttribute("role", "group");
    root.setAttribute("aria-label", t.timeAria);

    var head = el("div", "kc__head");
    head.appendChild(el("div", "kc__title", t.timeTitle));
    var btns = el("div", "kc__btns");
    var vBtns = ["group", "cum"].map(function (k) {
      var b = el("button", "mc__btn", t.view[k]);
      b.type = "button";
      b.addEventListener("click", function () { view = k; paint(); });
      btns.appendChild(b);
      return b;
    });
    head.appendChild(btns);
    root.appendChild(head);

    var rowsWrap = el("div", "kc__rows");
    var rows = TIME.map(function (n, i) {
      var r = el("button", "kc__row");
      r.type = "button";
      var lab = el("span", "kc__lab");
      var track = el("span", "kc__track");
      var fill = el("span", "kc__fill");
      track.appendChild(fill);
      var num = el("span", "kc__num");
      r.appendChild(lab);
      r.appendChild(track);
      r.appendChild(num);
      r.addEventListener("click", function () { sel = i; paint(); });
      r.addEventListener("mouseenter", function () { sel = i; paint(); });
      rowsWrap.appendChild(r);
      return { r: r, lab: lab, fill: fill, num: num };
    });
    root.appendChild(rowsWrap);

    var vals = readout(root, [t.timeKBuyers, t.timeKShare, t.timeKMed]);
    root.appendChild(el("div", "kc__note", t.timeNote));

    function paint() {
      var data = view === "cum" ? cum : TIME;
      var labels = view === "cum" ? t.cumRows : t.rows;
      vBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", ["group", "cum"][i] === view ? "true" : "false"); });
      rows.forEach(function (row, i) {
        row.lab.textContent = labels[i];
        row.fill.style.width = (data[i] / 20) * 100 + "%";
        row.num.textContent = String(data[i]);
        row.r.setAttribute("aria-pressed", i === sel ? "true" : "false");
        row.r.setAttribute("aria-label", labels[i] + ": " + data[i]);
      });
      vals[0].innerHTML = f0.format(data[sel]) + " <small>" + labels[sel].toLowerCase() + "</small>";
      vals[1].innerHTML = Math.round((data[sel] / 20) * 100) + " %";
      vals[2].innerHTML = "19 <small>" + t.days + "</small>";
    }
    paint();
  }

  function boot() {
    var roots = document.querySelectorAll(".kc[data-kind]");
    for (var i = 0; i < roots.length; i++) {
      var r = roots[i];
      var t = T[r.getAttribute("data-lang") === "en" ? "en" : "nl"];
      r.textContent = "";
      if (r.getAttribute("data-kind") === "dots") dots(r, t);
      else time(r, t);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
