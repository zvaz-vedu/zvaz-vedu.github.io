document.addEventListener("DOMContentLoaded", function() {

    function updateSrcs() {
        const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const mainLogoSrc = darkMode
            ? '/media/imgs/base/logo_transparent.webp'
            : '/media/imgs/base/logo_dark.webp';

        const markSrc = darkMode
            ? '/media/imgs/locations/kocka4bila.webp'
            : '/media/imgs/locations/kocka4cerna.webp';

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

        // Update .mark-img elements within .what-section
         document.querySelectorAll('.what-section img').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== markSrc) {
                  img.src = markSrc;
             }
         });


        // ADDED: Update .mark-img elements within .layout-container .layout-content
        document.querySelectorAll('.layout-container .layout-content .mark-img').forEach(function(img) {
            const currentRelativeSrc = new URL(img.src).pathname;
            if (currentRelativeSrc !== markSrc) {
                img.src = markSrc;
            }
        });

        // ADDED: Update .mark-img elements within .layout-container .layout-content
        document.querySelectorAll('.layout-container .layout-content .mark-img').forEach(function(img) {
            const currentRelativeSrc = new URL(img.src).pathname;
            if (currentRelativeSrc !== markSrc) {
                img.src = markSrc;
            }
        });

         document.querySelectorAll('#hero-graphics-icon').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== markSrc) {
                  img.src = markSrc;
             }
         });

         document.querySelectorAll('.header-graphics-logo').forEach(function(img) {
             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== markSrc) {
                  img.src = markSrc;
             }
         });

        document.querySelectorAll('.layout-container .layout-content .team-section .full-logo').forEach(function(img) {
            img.src = mainLogoSrc;
        });


         document.querySelectorAll('.partner-logo-img').forEach(function(img) {
             const baseName = img.dataset.partnerName;

             if (!baseName) {
                 console.warn("Partner image missing data-partner-name attribute:", img);
                 return;
             }

             const newSrc = darkMode
                 ? `/media/imgs/partners//monochrom/${baseName}-monochrom.webp`
                 : `/media/imgs/partners/${baseName}.webp`;

             const currentRelativeSrc = new URL(img.src).pathname;
             if (currentRelativeSrc !== newSrc) {
                  img.src = newSrc;
             }
         });
    }

     updateSrcs();

     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {
          updateSrcs();
     });
});