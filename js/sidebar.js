// Function to load the sidebar from sidebar.html
function loadSidebar() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'sidebar.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('custom-sidebar').innerHTML = xhr.responseText;
            
            // After loading the sidebar, highlight the current page link
            highlightCurrentPageLink();
        }
    };
    xhr.send();
}

// Function to highlight the current page link in the sidebar
function highlightCurrentPageLink() {
    // Get the current page URL
    var currentPageUrl = window.location.href;
    
    // Get all links in the sidebar
    var links = document.querySelectorAll('#custom-sidebar a');
    
    // Loop through each link and compare its href with the current page URL
    links.forEach(function(link) {
        if (link.href === currentPageUrl) {
            // Add 'active' class to the parent <li> element
            link.parentNode.classList.add('active');
        }
    });
}

// Load the sidebar when the page loads
document.addEventListener('DOMContentLoaded', loadSidebar);