function initCarousel() {
    const track = document.getElementById("aktualne-track");
    if (!track) return; // Pokud karusel neexistuje, skript se nespustí

    const prevButton = document.getElementById("aktualne-prev");
    const nextButton = document.getElementById("aktualne-next");
    if (!prevButton || !nextButton) return;

    let currentIndex = 0;
    let slides = Array.from(track.children);

    const getSlideWidthWithGap = () => {
        if (slides.length === 0) return 0;
        const slideWidth = slides[0].offsetWidth;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 0;
        return slideWidth + gap;
    };

    const updateButtons = () => {
        if (!track || slides.length === 0) return;
        prevButton.disabled = currentIndex === 0;
        const viewport = track.parentElement;
        if (!viewport) return;
        const viewportWidth = viewport.clientWidth;
        const lastSlide = slides[slides.length - 1];
        if (!lastSlide) return;
        const lastSlideRight = lastSlide.offsetLeft + lastSlide.offsetWidth;
        const currentTranslate = currentIndex * getSlideWidthWithGap();
        nextButton.disabled = (lastSlideRight - currentTranslate) <= viewportWidth + 5;
    };

    const moveToSlide = (index) => {
        const slideWidthWithGap = getSlideWidthWithGap();
        track.style.transform = `translateX(-${index * slideWidthWithGap}px)`;
        currentIndex = index;
        updateButtons();
    };

    const setup = () => {
        slides = Array.from(track.children);
        if (slides.length === 0) return;
        moveToSlide(0);
    };

    nextButton.addEventListener("click", () => {
        if (currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener("click", () => {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setup();
        }, 250);
    });

    setTimeout(setup, 100);
}

window.initCarousel = initCarousel;
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
} else {
    initCarousel();
}