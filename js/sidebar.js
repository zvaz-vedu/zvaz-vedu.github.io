// Updated function to load the sidebar from sidebar.html with the new id
function loadSidebar() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'sidebar.html', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('custom-sidebar').innerHTML = xhr.responseText;
            highlightCurrentPageLink();
        }
    };
    xhr.send();
}
// Function to highlight the current page link in the sidebar
function highlightCurrentPageLink() {
    const links = document.querySelectorAll('#sidebar a');
    const currentPage = window.location.pathname.split('/').pop();

    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Load the sidebar when the page loads
document.addEventListener('DOMContentLoaded', loadSidebar);