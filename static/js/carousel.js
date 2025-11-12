document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("aktualne-track");
    if (!track) return; // Pokud karusel neexistuje, skript se nespustí

    const prevButton = document.getElementById("aktualne-prev");
    const nextButton = document.getElementById("aktualne-next");

    let currentIndex = 0;
    let slides = []; // Karty načteme až po inicializaci

    // Funkce pro aktualizaci stavu tlačítek
    const updateButtons = () => {
        if (!track || slides.length === 0) return;

        // Tlačítko "zpět" je neaktivní na první kartě
        prevButton.disabled = currentIndex === 0;

        // Kontrola, zda jsme na konci
        // Potřebujeme zjistit, kolik karet se vejde do viewportu
        const viewport = track.parentElement;
        const viewportWidth = viewport.clientWidth;
        
        // Zjistíme pozici poslední karty
        const lastSlide = slides[slides.length - 1];
        const lastSlideRight = lastSlide.offsetLeft + lastSlide.offsetWidth;
        
        // Zjistíme aktuální posun
        const currentTranslate = currentIndex * getSlideWidthWithGap();

        // Pokud je pozice poslední karty (plus posun) menší nebo rovna šířce viewportu, jsme na konci
        // Efektivně: pokud je pravý okraj poslední karty viditelný nebo vlevo od pravého okraje viewportu
        nextButton.disabled = (lastSlideRight - currentTranslate) <= viewportWidth + 5; // +5px pro jistotu
    };

    // Funkce pro posun karuselu
    const moveToSlide = (index) => {
        const slideWidthWithGap = getSlideWidthWithGap();
        track.style.transform = `translateX(-${index * slideWidthWithGap}px)`;
        currentIndex = index;
        updateButtons();
    };

    // Získá šířku karty VČETNĚ mezery (gap)
    const getSlideWidthWithGap = () => {
        if (slides.length === 0) return 0;
        
        const slideWidth = slides[0].offsetWidth;
        // Získáme styl 'gap' z rodičovského elementu (track)
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 0;
        
        return slideWidth + gap;
    };


    // Inicializace karuselu
    const initCarousel = () => {
        slides = Array.from(track.children); // Načteme karty
        if (slides.length === 0) return;
        
        // Vypočítáme, kolik karet se vejde na obrazovku
        // Toto je zjednodušený výpočet pro "jedna karta za posun"
        // který je pro tento design nejlepší
        
        moveToSlide(0); // Začneme na první kartě
    };

    // Posluchače událostí
    nextButton.addEventListener("click", () => {
        // Posun o jednu kartu doprava, pokud nejsme na konci
        // Kontrolujeme, zda je další index stále platný
        if (currentIndex < slides.length - 1) {
            moveToSlide(currentIndex + 1);
        }
    });

    prevButton.addEventListener("click", () => {
        // Posun o jednu kartu doleva, pokud nejsme na začátku
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    });

    // Přepočítání při změně velikosti okna
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCarousel(); // Reinicializujeme karusel
        }, 250); // Debounce pro výkon
    });

    // První spuštění
    // Malá prodleva, aby se zajistilo, že se vše načetlo správně (hlavně CSS)
    setTimeout(initCarousel, 100);
});