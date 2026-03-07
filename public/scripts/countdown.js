(function () {
  var wedding = new Date(2026, 5, 21, 0, 0, 0, 0);

  function pad2(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function tick() {
    var now = new Date();
    var diff = wedding - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      return;
    }

    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    var secs = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hours);
    minsEl.textContent = pad2(mins);
    secsEl.textContent = pad2(secs);
  }

  var daysEl = document.getElementById("countdown-days");
  var hoursEl = document.getElementById("countdown-hours");
  var minsEl = document.getElementById("countdown-mins");
  var secsEl = document.getElementById("countdown-secs");

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  tick();
  setInterval(tick, 1000);
})();
