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
    "harmonic-keyboard-tuner.html": "music-theory-tools.html",
    "harmonic-grid.html": "music-theory-tools.html",
    "harmonic-circle.html": "music-theory-tools.html",
    "harmonics.html": "music-theory-tools.html",
    "microtonal-tuner.html": "music-theory-tools.html",
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

/* Copyright notice on every page, and the hardware enquiry on the instrument pages. */
(function () {
  var RIGHTS = "Rex Audio retains all rights to its designs: web apps, digital plugins and hardware.";
  var HW_PAGES = ["music-theory-tools.html", "tunings.html", "chordseq.html", "microtonal-tuner.html"];
  var here = (location.pathname.split("/").pop() || "index.html");
  var foot = document.querySelector("#site footer") || document.querySelector("footer") || document.querySelector(".sitefoot");
  if (HW_PAGES.indexOf(here) >= 0 && !document.querySelector(".hw, .rx-hw") && foot) {
    var bg = getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [255, 255, 255];
    var dark = (0.3 * bg[0] + 0.59 * bg[1] + 0.11 * bg[2]) < 110;
    var st = document.createElement("style");
    st.textContent = ".rx-hw { margin: 56px 36px 0; text-align: center; font: 700 34px/1.2 Arial, Helvetica, sans-serif; letter-spacing: -0.02em; color: " + (dark ? "#dbe9f5" : "#15181a") + "; }" +
      ".rx-hw a { display: inline-block; margin-top: 18px; padding: 15px 34px; border-radius: 8px; background: " + (dark ? "#dbe9f5" : "#15181a") + "; color: " + (dark ? "#0d141b" : "#f3f4f5") + "; font-size: 22px; letter-spacing: 0; text-decoration: none; }" +
      ".rx-hw a:hover { opacity: .85; } .rx-hw a:focus-visible { outline: 2px solid #c8321e; outline-offset: 2px; }" +
      ".rx-rights { display: block; }";
    document.head.appendChild(st);
    var hw = document.createElement("p"); hw.className = "rx-hw";
    hw.appendChild(document.createTextNode("Interested in the hardware?"));
    hw.appendChild(document.createElement("br"));
    hw.appendChild(document.createTextNode("Get in touch and we’ll build it."));
    hw.appendChild(document.createElement("br"));
    var a = document.createElement("a"); a.href = "mailto:rex-audio@outlook.com?subject=" + encodeURIComponent("Hardware: " + document.title.replace(/ \| Rex Audio$/, "")); a.textContent = "Get in touch"; hw.appendChild(a);
    foot.parentNode.insertBefore(hw, foot);
  }
  var f = document.querySelector("footer"), here2 = here;
  var MAIN = "© 2026 Rex Audio. All rights reserved. Free: personal use of the website to play the instruments. Paid licence: commercially release music made with any Rex Audio software. Distributing or modifying it needs permission. ";
  if (f && f.querySelector(".rx-lic") === null) {
    Array.prototype.slice.call(f.querySelectorAll("span, br")).forEach(function (e) { if (e.tagName === "BR" || /rights|©/.test(e.textContent)) e.parentNode.removeChild(e); });
    var sp = document.createElement("span"); sp.className = "rx-lic"; sp.appendChild(document.createTextNode(MAIN));
    if (here2 !== "licence.html") { var l = document.createElement("a"); l.href = "licence.html"; l.textContent = "Licence"; sp.appendChild(l); }
    if (f.classList.contains("sitefoot")) f.innerHTML = "";
    f.appendChild(sp);
  }
})();
