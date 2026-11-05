/* The one list of pages in the top menu. Every page loads this file, so a new link only needs adding here. */
(function () {
  var LINKS = [
    ["shapes.html", "Shapes"],
    ["chordseq.html", "ChordSeq"],
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
