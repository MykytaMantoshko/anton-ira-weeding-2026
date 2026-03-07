(function () {
  var preloader = document.getElementById("preloader");
  if (!preloader) return;

  var delayMs = 2000;
  var animationDurationMs = 2200;

  function openEnvelope() {
    preloader.classList.add("preloader-open");
  }

  function hidePreloader() {
    preloader.classList.add("preloader-hidden");
  }

  setTimeout(openEnvelope, delayMs);
  setTimeout(hidePreloader, delayMs + animationDurationMs);
})();
