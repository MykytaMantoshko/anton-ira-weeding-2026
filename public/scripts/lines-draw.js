(function () {
  var linesEl = document.getElementById("lines");
  var path = document.getElementById("lines-path");
  if (!linesEl || !path) return;

  var length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  function update() {
    var rect = linesEl.getBoundingClientRect();
    var winH = window.innerHeight;
    var scrollY = window.scrollY || window.pageYOffset;
    var elTop = rect.top + scrollY;
    var elHeight = linesEl.offsetHeight;

    var progress = (scrollY - elTop + winH) / (elHeight + winH);
    progress = Math.max(0, Math.min(1, progress));

    path.style.strokeDashoffset = length * (1 - progress);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
