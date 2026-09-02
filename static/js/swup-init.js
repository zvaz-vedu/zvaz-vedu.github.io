// static/js/swup-init.js

(function() {
    if (typeof Swup === 'undefined') {
        console.warn('Swup is not loaded.');
        return;
    }

    const plugins = [];

    if (typeof SwupHeadPlugin !== 'undefined') {
        plugins.push(new SwupHeadPlugin({
            awaitAssets: true
        }));
    }

    if (typeof SwupPreloadPlugin !== 'undefined') {
        plugins.push(new SwupPreloadPlugin({
            throttle: 4
        }));
    }

    if (typeof SwupScriptsPlugin !== 'undefined') {
        plugins.push(new SwupScriptsPlugin({
            optin: true // Only reload scripts with [data-swup-reload-script]
        }));
    }

    const swup = new Swup({
        containers: ['#swup'],
        animationSelector: '[class*="transition-"]',
        plugins: plugins
    });

    function reinitPageComponents() {
        // Carousel (home)
        if (typeof window.initCarousel === 'function') {
            window.initCarousel();
        }
        // Counters & Countdown (location)
        if (typeof window.initCounters === 'function') {
            window.initCounters();
        }
        // Reveal sections (home)
        if (typeof window.initRevealSections === 'function') {
            window.initRevealSections();
        }
        // Speakers filtering (speakers)
        if (typeof window.initSpeakers === 'function') {
            window.initSpeakers();
        }
        // Partners hover (partneri)
        if (typeof window.initSupporters === 'function') {
            window.initSupporters();
        }
        // Gallery height synchronization (location & report)
        if (typeof window.syncLocationGalleryHeights === 'function') {
            window.syncLocationGalleryHeights();
        }
        if (typeof window.syncReportGalleryHeights === 'function') {
            window.syncReportGalleryHeights();
        }
    }

    // Wait for critical hero images to decode before fading in new content
    // This completely eliminates any blank frame or alt-text placeholder!
    swup.hooks.before('animation:in:start', async () => {
        const heroImages = document.querySelectorAll(
            '#swup .header-graphics-photo, #swup #hero-graphics-primary, #swup #hero-graphics-secondary, #swup .header-graphics-logo, #swup #hero-graphics-icon, #swup .mark-img'
        );

        if (heroImages.length > 0) {
            const decodePromises = Array.from(heroImages).map(img => {
                if (img.complete && img.naturalWidth > 0) {
                    return typeof img.decode === 'function' ? img.decode().catch(() => {}) : Promise.resolve();
                }
                return new Promise(resolve => {
                    img.addEventListener('load', () => {
                        if (typeof img.decode === 'function') {
                            img.decode().catch(() => {}).finally(resolve);
                        } else {
                            resolve();
                        }
                    }, { once: true });
                    img.addEventListener('error', resolve, { once: true });
                });
            });

            // Allow at most 200ms for decode; if network is slow, it proceeds anyway
            await Promise.race([
                Promise.all(decodePromises),
                new Promise(resolve => setTimeout(resolve, 200))
            ]);
        }
    });

    swup.hooks.on('page:view', () => {
        document.body.classList.remove('menu-open');
        reinitPageComponents();
        // Reset scroll position to top
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });

    // Run on initial load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', reinitPageComponents);
    } else {
        reinitPageComponents();
    }

    window.swupInstance = swup;
})();
