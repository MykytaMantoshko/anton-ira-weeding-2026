(function () {
  const container = document.querySelector(".clothes-slider");
  const track = document.querySelector(".clothes-slider-track");
  const prevBtn = document.querySelector(".clothes-slider-prev");
  const nextBtn = document.querySelector(".clothes-slider-next");
  if (!container || !track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll(".clothes-slider-slide");
  const total = slides.length;
  let currentIndex = 5;

  function getGapPx() {
    const gap = getComputedStyle(track).gap;
    return gap ? parseFloat(gap) || 4 : 4;
  }

  function getSlideWidth() {
    return container.clientWidth;
  }

  function goTo(index) {
    const w = getSlideWidth();
    const gap = getGapPx();
    track.style.transform = `translateX(-${index * (w + gap)}px)`;
    currentIndex = index;
  }

  function init() {
    const w = getSlideWidth();
    const gap = getGapPx();
    track.style.width = `${total * w + (total - 1) * gap}px`;
    slides.forEach((s) => {
      s.style.width = `${w}px`;
      s.style.minWidth = `${w}px`;
    });
    goTo(5);
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + total) % total;
    goTo(currentIndex);
  });
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % total;
    goTo(currentIndex);
  });

  init();
  window.addEventListener("resize", init);
})();
