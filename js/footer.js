document.addEventListener("DOMContentLoaded", function () {
    // Function to load the footer content
    function loadFooter(footerType, containerId) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "footer_" + footerType + ".html", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                document.getElementById(containerId).innerHTML = xhr.responseText;
                highlightCurrentPageLink();
            }
        };
        xhr.send();
    }

    // Function to highlight the current page link
    function highlightCurrentPageLink() {
        var currentPage = window.location.pathname; // Get current page path (e.g., /home or /home.html)

        // Remove trailing slash if it exists
        if (currentPage.endsWith('/')) {
            currentPage = currentPage.slice(0, -1);
        }

        // Remove .html extension if present
        if (currentPage.endsWith('.html')) {
            currentPage = currentPage.replace('.html', '');
        }

        var links = document.querySelectorAll(".lik a");
        links.forEach(function (link) {
            var linkPath = new URL(link.href).pathname; // Get path part of link href

            // Remove trailing slash from link path
            if (linkPath.endsWith('/')) {
                linkPath = linkPath.slice(0, -1);
            }

            // Remove .html extension from link path
            if (linkPath.endsWith('.html')) {
                linkPath = linkPath.replace('.html', '');
            }

            // Highlight the link if paths match (ignores domain, query params, etc.)
            if (currentPage === linkPath) {
                link.parentElement.classList.add("active");
            }
        });
    }

    // Function to check if the user has scrolled to the bottom of the page
    function checkScroll() {
        var windowHeight = window.innerHeight;
        var documentHeight = document.body.clientHeight;
        var scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

        var sponsorsElement = document.getElementById('sponsors');

        if (documentHeight - windowHeight <= scrollPosition + 10) {  // Adding some margin for smoother transition
            // User has scrolled to the bottom
            sponsorsElement.classList.add('visible');
        } else {
            // User hasn't scrolled to the bottom
            sponsorsElement.classList.remove('visible');
        }
    }

    // Load PC footer
    loadFooter("pc", "pcFooterContainer");

    // Load mobile footer
    loadFooter("mobile", "mobileFooterContainer");

    // Add scroll event listener to check if the user has scrolled to the bottom
    window.addEventListener('scroll', checkScroll);
});
