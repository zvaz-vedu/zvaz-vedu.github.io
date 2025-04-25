document.addEventListener("DOMContentLoaded", function() {

    console.log("darkmode.js: Script started."); // Confirm script execution start

    function updateLogos() {
        // Check if the user prefers dark mode
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log("darkmode.js: updateLogos function called. Dark mode detected:", darkMode);

        // Define logo sources based on dark mode
        const mainLogoSrc = darkMode
            ? '/media/imgs/base/logo_transparent.png' // Logo for dark mode
            : '/media/imgs/base/logo_dark.png';       // Logo for light mode
        console.log("darkmode.js: mainLogoSrc =", mainLogoSrc);

        const markSrc = darkMode
            ? '/media/imgs/base/mark.png'             // Mark for dark mode
            : '/media/imgs/base/mark-blk.png';       // Mark for light mode
        console.log("darkmode.js: markSrc =", markSrc);

         const micSrc = darkMode
            ? '/media/imgs/base/mic-light.png'        // Mic for dark mode
            : '/media/imgs/base/mic';                // Mic for light mode (check extension)
        console.log("darkmode.js: micSrc =", micSrc);


        const goalSrc = darkMode
            ? '/media/imgs/base/goal-light.png'       // Goal for dark mode
            : '/media/imgs/base/goal.png';           // Goal for light mode
        console.log("darkmode.js: goalSrc =", goalSrc);


        // --- Update Desktop Navbar Logos ---
        console.log("darkmode.js: Attempting to update desktop logos.");
        const desktopMainLogo = document.querySelector('.desktop-navbar .nav-logo img');
        if (desktopMainLogo) {
            console.log("darkmode.js: Desktop main logo found:", desktopMainLogo);
            // Use URL object for reliable comparison
            const currentRelativeSrc = new URL(desktopMainLogo.src).pathname;
            console.log("darkmode.js: Desktop main logo current src:", currentRelativeSrc);
            if (currentRelativeSrc !== mainLogoSrc) {
                 console.log("darkmode.js: Desktop main logo src different, updating...");
                 desktopMainLogo.src = mainLogoSrc;
                 console.log("darkmode.js: Desktop main logo src updated to:", desktopMainLogo.src);
            } else {
                 console.log("darkmode.js: Desktop main logo src already correct.");
            }
        } else {
             console.log("darkmode.js: Desktop main logo element NOT found.");
        }

        const desktopMarkLogo = document.querySelector('.desktop-navbar .mark-img');
         if (desktopMarkLogo) {
            console.log("darkmode.js: Desktop mark logo found:", desktopMarkLogo);
             // Use URL object for reliable comparison
            const currentRelativeSrc = new URL(desktopMarkLogo.src).pathname;
             console.log("darkmode.js: Desktop mark logo current src:", currentRelativeSrc);
             if (currentRelativeSrc !== markSrc) {
                 console.log("darkmode.js: Desktop mark logo src different, updating...");
                 desktopMarkLogo.src = markSrc;
                 console.log("darkmode.js: Desktop mark logo src updated to:", desktopMarkLogo.src);
             } else {
                 console.log("darkmode.js: Desktop mark logo src already correct.");
             }
        } else {
             console.log("darkmode.js: Desktop mark logo element NOT found.");
        }

        // --- Update Mobile Top Logo Bar Logo ---
        console.log("darkmode.js: Attempting to update mobile top logo.");
        const mobileTopLogo = document.querySelector('.mobile-top-logo-bar .nav-logo'); // Assuming the img has class nav-logo
        console.log("darkmode.js: Using selector:", '.mobile-top-logo-bar .nav-logo');

        if (mobileTopLogo) {
             console.log("darkmode.js: Mobile top logo element FOUND:", mobileTopLogo);

             // --- TEMPORARILY FORCE UPDATE FOR DEBUGGING ---
             console.log("darkmode.js: FORCING Mobile top logo src update...");
             mobileTopLogo.src = mainLogoSrc;
             console.log("darkmode.js: Mobile top logo src updated to:", mobileTopLogo.src);
             // --- END FORCE UPDATE ---

             // You can uncomment the comparison logic below if the force update works
             /*
             const currentRelativeSrc = new URL(mobileTopLogo.src).pathname;
             console.log("darkmode.js: Mobile top logo current relative src:", currentRelativeSrc);
             console.log("darkmode.js: Mobile top logo target src:", mainLogoSrc);
             if (currentRelativeSrc !== mainLogoSrc) {
                  console.log("darkmode.js: Mobile top logo src is different, updating...");
                  mobileTopLogo.src = mainLogoSrc;
                  console.log("darkmode.js: Mobile top logo src updated to:", mobileTopLogo.src);
             } else {
                  console.log("darkmode.js: Mobile top logo src already correct, no update needed.");
             }
             */

        } else {
             console.log("darkmode.js: Mobile top logo element NOT found with selector:", '.mobile-top-logo-bar .nav-logo');
        }


        // --- Update Footer Logo ---
         console.log("darkmode.js: Attempting to update footer logos.");
        document.querySelectorAll('.footer-logo').forEach(function(img) {
             // ... (existing footer logo logic) ...
             if (img.tagName === 'IMG') {
                 const currentRelativeSrc = new URL(img.src).pathname;
                 if (currentRelativeSrc !== mainLogoSrc) {
                     img.src = mainLogoSrc;
                 }
             } else {
                 const internalImg = img.querySelector('img');
                 if (internalImg) {
                     const currentRelativeSrc = new URL(internalImg.src).pathname;
                     if (currentRelativeSrc !== mainLogoSrc) {
                          internalImg.src = mainLogoSrc;
                     }
                 }
             }
        });


        // --- Update Mic Logo ---
         console.log("darkmode.js: Attempting to update mic logos.");
        document.querySelectorAll('.mic-img').forEach(function(img) {
             // ... (existing mic logo logic) ...
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== micSrc) {
                  img.src = micSrc;
             }
        });

        // --- Update Goal Logo ---
         console.log("darkmode.js: Attempting to update goal logos.");
        document.querySelectorAll('.goal-img').forEach(function(img) {
             // ... (existing goal logo logic) ...
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== goalSrc) {
                  img.src = goalSrc;
             }
        });


        // --- Update Partner Logos (Existing Logic) ---
         console.log("darkmode.js: Attempting to update partner logos.");
        document.querySelectorAll('.partner-logo-img').forEach(function(img) {
            // ... (existing partner logo logic) ...
            const baseName = img.dataset.partnerName;
            if (!baseName) {
                console.warn("darkmode.js: Partner image missing data-partner-name attribute:", img);
                return;
            }
            const newSrc = darkMode
                ? `/media/imgs/partners/${baseName}-monochrom.png`
                : `/media/imgs/partners/${baseName}.png`;
            const currentRelativeSrc = new URL(img.src).pathname;
            if (currentRelativeSrc !== newSrc) {
                 img.src = newSrc;
            }
        });
        // --- End Partner Logos ---
        console.log("darkmode.js: updateLogos function finished.");
    }

    // Initial logo update on page load
    console.log("darkmode.js: DOMContentLoaded fired. Calling updateLogos for initial load.");
    updateLogos();


    // Listen for changes in the dark mode preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {
         console.log("darkmode.js: prefers-color-scheme change detected. Calling updateLogos...");
         updateLogos();
    });

    console.log("darkmode.js: Script finished setup."); // Confirm script setup finished
});
