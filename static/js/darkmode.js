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

        const micSrc = darkMode 
            ? '/media/imgs/base/mic-light.png' 
            : '/media/imgs/base/mic';

        const goalSrc = darkMode 
            ? '/media/imgs/base/goal-light.png' 
            : '/media/imgs/base/goal.png';

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

        // Update the mic logo
        document.querySelectorAll('.mic-img').forEach(function(img) {
            img.src = micSrc;
        });

        // Update the mic logo
        document.querySelectorAll('.goal-img').forEach(function(img) {
            img.src = goalSrc;
        });
    }

    // Initial logo update on page load
    updateLogo();

    // Listen for changes in the dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', updateLogo);
});