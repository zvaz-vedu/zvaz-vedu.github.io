document.addEventListener("DOMContentLoaded", function() {

    function updateLogos() {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const mainLogoSrc = darkMode
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


        const desktopMainLogo = document.querySelector('.desktop-navbar .nav-logo img');
        if (desktopMainLogo) {
            const currentRelativeSrc = new URL(desktopMainLogo.src).pathname;
            if (currentRelativeSrc !== mainLogoSrc) {
                 desktopMainLogo.src = mainLogoSrc;
            }
        }

        const desktopMarkLogo = document.querySelector('.desktop-navbar .mark-img');
         if (desktopMarkLogo) {
            const currentRelativeSrc = new URL(desktopMarkLogo.src).pathname;
             if (currentRelativeSrc !== markSrc) {
                 desktopMarkLogo.src = markSrc;
             }
        }

        const mobileTopLogo = document.querySelector('.mobile-top-bar .mobile-logo-link .nav-logo');
        if (mobileTopLogo) {
             const currentRelativeSrc = new URL(mobileTopLogo.src).pathname;
             if (currentRelativeSrc !== mainLogoSrc) {
                  mobileTopLogo.src = mainLogoSrc;
             }
        }


        document.querySelectorAll('.footer-logo').forEach(function(element) {
             if (element.tagName === 'IMG') {
                 const currentRelativeSrc = new URL(element.src).pathname;
                 if (currentRelativeSrc !== mainLogoSrc) {
                     element.src = mainLogoSrc;
                 }
             } else {
                 const internalImg = element.querySelector('img');
                 if (internalImg) {
                     const currentRelativeSrc = new URL(internalImg.src).pathname;
                     if (currentRelativeSrc !== mainLogoSrc) {
                          internalImg.src = mainLogoSrc;
                     }
                 }
             }
        });


        document.querySelectorAll('.mic-img').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== micSrc) {
                  img.src = micSrc;
             }
        });

        document.querySelectorAll('.goal-img').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== goalSrc) {
                  img.src = goalSrc;
             }
        });

        document.querySelectorAll('.what-section img').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== markSrc) {
                  img.src = markSrc;
             }
        });


        document.querySelectorAll('.partner-logo-img').forEach(function(img) {
            const baseName = img.dataset.partnerName;

            if (!baseName) {
                console.warn("Partner image missing data-partner-name attribute:", img);
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
    }

    updateLogos();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {
         updateLogos();
    });
});
