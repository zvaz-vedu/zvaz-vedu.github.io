document.addEventListener("DOMContentLoaded", function() {
    function updateLogos() { // Renamed function slightly
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // --- Your existing logic for other logos (nav, footer, etc.) ---
        // Choose the appropriate base image source
        const logoSrc = darkMode
            ? '/media/imgs/base/logo_transparent.png'
            : '/media/imgs/base/logo_dark.png';

        const markSrc = darkMode
            ? '/media/imgs/base/mark.png'
            : '/media/imgs/base/mark-blk.png';

         const micSrc = darkMode
            ? '/media/imgs/base/mic-light.png'
            : '/media/imgs/base/mic'; // Check this mic path in light mode

        const goalSrc = darkMode
            ? '/media/imgs/base/goal-light.png'
            : '/media/imgs/base/goal.png';

        // Update the nav logo
        document.querySelectorAll('.nav-logo img').forEach(function(img) {
            img.src = logoSrc;
        });

        // Update the footer logo
        document.querySelectorAll('.footer-logo').forEach(function(img) {
             if (img.tagName === 'IMG') {
                 img.src = logoSrc;
             } else {
                 const internalImg = img.querySelector('img');
                 if (internalImg) {
                     internalImg.src = logoSrc;
                 }
             }
        });

        // Update the mark logo
        document.querySelectorAll('.mark-img').forEach(function(img) {
            img.src = markSrc;
        });

        // Update the mic logo
        document.querySelectorAll('.mic-img').forEach(function(img) {
            img.src = micSrc;
        });

        // Update the goal logo
        document.querySelectorAll('.goal-img').forEach(function(img) {
            img.src = goalSrc;
        });
        // --- End existing logic ---

        // --- UPDATED PART FOR PARTNER LOGOS ---
        // Select all partner images using the class
        document.querySelectorAll('.partner-logo-img').forEach(function(img) {
            console.log("Updating partner logo:", img); // Debugging log
            // Get the base name directly from the data attribute set by Hugo
            const baseName = img.dataset.partnerName; // dataset.partnerName accesses data-partner-name

            if (!baseName) {
                console.warn("Partner image missing data-partner-name attribute:", img);
                return; // Skip this image if the data attribute is missing
            }

            // Construct the new source based on dark mode preference and base name
            const newSrc = darkMode
                ? `/media/imgs/partners/${baseName}-monochrom.png`
                : `/media/imgs/partners/${baseName}.png`;

            // Update the image source only if it's different
            // Use URL object to reliably get the path part of the current src
            const currentRelativeSrc = new URL(img.src).pathname;
            if (currentRelativeSrc !== newSrc) {
                 img.src = newSrc;
            }
        });
        // --- END UPDATED PART ---

    }

    // Initial logo update on page load
    console.log("Initial logo update on page load");
    updateLogos();

    // Listen for changes in the dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogos);
});