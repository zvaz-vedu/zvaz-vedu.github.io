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
        var currentPage = window.location.href;
        var links = document.querySelectorAll(".lik a");
        links.forEach(function (link) {
            if (link.href === currentPage) {
                link.parentElement.classList.add("active");
            }
        });
    }

    // Function to check if the user has scrolled to the bottom of the page
    function checkScroll() {
        var windowHeight = window.innerHeight;
        var documentHeight = document.body.clientHeight;
        var scrollPosition = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);

        if (documentHeight - windowHeight <= scrollPosition) {
            // User has scrolled to the bottom
            document.getElementById('sponsors').style.visibility = 'visible';
            document.getElementById('sponsors').style.display = 'block';
        } else {
            // User hasn't scrolled to the bottom
            document.getElementById('sponsors').style.visibility = 'hidden';
            document.getElementById('sponsors').style.display = 'none';
        }
    }

    // Load PC footer
    loadFooter("pc", "pcFooterContainer");

    // Load mobile footer
    loadFooter("mobile", "mobileFooterContainer");

    // Add scroll event listener to check if the user has scrolled to the bottom
    window.addEventListener('scroll', checkScroll);
});