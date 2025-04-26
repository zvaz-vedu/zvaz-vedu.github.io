document.addEventListener("DOMContentLoaded", function() {
    const hamburgerButton = document.querySelector('.hamburger-button');
    const closeMenuButton = document.querySelector('.close-menu-button');
    const mobileMenu = document.querySelector('.mobile-off-canvas-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.mobile-off-canvas-menu .mobile-menu-link'); // Select links inside the menu

    // Check if the elements exist before adding event listeners
    if (hamburgerButton && mobileMenu && overlay && body) {

        // Function to open the menu
        function openMenu() {
            body.classList.add('menu-open');
        }

        // Function to close the menu
        function closeMenu() {
            body.classList.remove('menu-open');
        }

        // Event listener for the hamburger button to open the menu
        hamburgerButton.addEventListener('click', openMenu);

        // Event listener for the close button to close the menu
        if (closeMenuButton) { // Check if close button exists
            closeMenuButton.addEventListener('click', closeMenu);
        }


        // Event listener for the overlay to close the menu when clicked
        overlay.addEventListener('click', closeMenu);

        // Event listeners for menu links to close the menu when a link is clicked
        menuLinks.forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        // Optional: Close menu on swipe right (more advanced)
        // You would need to add touch event listeners (touchstart, touchmove, touchend)
        // to the menu or overlay and calculate swipe direction/distance.
    } else {
        console.error("Mobile menu elements not found. Check your HTML selectors.");
    }
});
