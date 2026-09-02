function initRevealSections() {
    document.querySelectorAll(".grid-board-item h4").forEach(heading => {
        // Prevent adding multiple click handlers to the same heading
        if (heading.dataset.revealInitialized) return;
        heading.dataset.revealInitialized = "true";

        heading.addEventListener("click", () => {
            const parentItem = heading.closest(".grid-board-item");
            if (parentItem) {
                parentItem.classList.toggle("active");
            }
        });
    });
}

window.initRevealSections = initRevealSections;
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initRevealSections);
} else {
    initRevealSections();
}
