/* The one list of pages in the top menu. Every page loads this file, so a new link only needs adding here. */
(function () {
  var LINKS = [
    ["shapes.html", "Shapes"],
    ["music-theory-tools.html", "Theory"],
    ["drums.html", "Drums"],
    ["colours.html", "Colours"],
    ["loops.html", "Loops"],
    ["shapes.html#support", "Support"]
  ];
  // pages that belong under another menu item
  var PARENT = {
    "harmonic-grid.html": "music-theory-tools.html",
    "harmonic-circle.html": "music-theory-tools.html",
    "harmonics.html": "music-theory-tools.html",
    "chordseq.html": "music-theory-tools.html",
    "tunings.html": "music-theory-tools.html"
  };
  var nav = document.querySelector('.top nav[aria-label="Main"]');
  if (!nav) return;
  var here = (location.pathname.split("/").pop() || "index.html");
  here = PARENT[here] || here;
  nav.textContent = "";
  LINKS.forEach(function (l) {
    var a = document.createElement("a");
    a.href = l[0]; a.textContent = l[1];
    if (l[0] === here) a.setAttribute("aria-current", "page");
    nav.appendChild(a);
  });
})();

/* On a phone or tablet, fit the page to the width that is actually shown. In a browser's "desktop site" mode that can be wider than the width the page first measures, which left the page small in the middle of the screen. */
(function () {
  var site = document.getElementById("site");
  if (!site || !window.matchMedia || !matchMedia("(pointer: coarse)").matches) return;
  function fit() {
    var vv = window.visualViewport;
    site.style.zoom = 0.3; void site.offsetWidth;   // measure while the page is too small to overflow, so it cannot widen the viewport itself
    var w = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0, vv ? vv.width : 0);
    site.classList.remove("wide");
    site.style.zoom = Math.max(w / 720, 0.3);
  }
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", fit);
  window.addEventListener("load", fit);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fit);
  fit(); setTimeout(fit, 150); setTimeout(fit, 600); setTimeout(fit, 1500);
})();
