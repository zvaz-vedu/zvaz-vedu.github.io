document.addEventListener("DOMContentLoaded", function() {
    function updateLogo() {
        // Check if the user prefers dark mode
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Choose the appropriate logo image source
        const logoSrc = darkMode 
            ? '/media/imgs/base/logo_transparent.png' 
            : '/media/imgs/base/logo_dark.png';

        const markSrc = darkMode 
            ? '/media/imgs/base/mark.png' 
            : '/media/imgs/base/mark-blk.png';

        // Update the nav logo
        document.querySelectorAll('.nav-logo img').forEach(function(img) {
            img.src = logoSrc;
        });

        // Update the footer logo
        document.querySelectorAll('.footer-logo').forEach(function(img) {
            img.src = logoSrc;
        });

        // Update the mark logo
        document.querySelectorAll('.mark-img').forEach(function(img) {
            img.src = markSrc;
        });
    }

    // Initial logo update on page load
    updateLogo();

    // Listen for changes in the dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', updateLogo);
});