function initSpeakers() {
    const container = document.getElementById('speakers-container');
    if (!container) return;

    // Reveal Button Toggle
    if (!container.dataset.speakersInitialized) {
        container.dataset.speakersInitialized = "true";
        container.addEventListener('click', event => {
            const revealButton = event.target.closest('.reveal-button');
            if (!revealButton) return;

            const speakerBio = revealButton.closest('.speaker-bio');
            if (!speakerBio) return;

            const text = speakerBio.querySelector('.speaker-bio-text');
            const label = revealButton.querySelector('.reveal-button-label');
            const icon = revealButton.querySelector('i');
            if (!text || !label || !icon) return;

            const isHidden = text.style.display === 'none' || text.style.display === '';

            text.style.display = isHidden ? 'block' : 'none';
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
            label.textContent = isHidden ? 'Méně' : 'Více';
        });
    }

    // Search and Location Filtering
    const speakerSearch = document.getElementById('speaker-search');
    const locationFilters = document.querySelectorAll('.speaker-filters-container input[type="checkbox"]');

    function applySpeakerFilters() {
        const searchValue = speakerSearch ? speakerSearch.value.toLowerCase() : '';
        
        const activeFilters = Array.from(locationFilters)
            .filter(f => f.checked)
            .map(f => {
                let id = f.id.toLowerCase(); 
                return id.startsWith('location-') ? id : `location-${id}`;
            });

        const speakers = document.querySelectorAll('.speaker');
        const mapRegions = document.querySelectorAll('.map-region'); 

        speakers.forEach(speaker => {
            const speakerName = speaker.querySelector('.speaker-name')?.textContent.toLowerCase() || '';
            const matchesSearch = speakerName.includes(searchValue);
            
            const matchesLocation =
                activeFilters.length === 0 ||
                activeFilters.some(filterClass => speaker.classList.contains(filterClass));

            speaker.style.display = (matchesSearch && matchesLocation) ? 'flex' : 'none';
        });

        if (mapRegions) {
            mapRegions.forEach(region => {
                if (activeFilters.length === 0) {
                    region.style.fill = 'var(--black-zv)';
                } else {
                    const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
                    region.style.fill = hasMatch ? 'var(--accent)' : 'var(--black-zv)';
                }
            });
        }
    }

    if (speakerSearch && !speakerSearch.dataset.searchInitialized) {
        speakerSearch.dataset.searchInitialized = "true";
        speakerSearch.addEventListener('input', applySpeakerFilters);
    }

    locationFilters.forEach(filter => {
        if (!filter.dataset.filterInitialized) {
            filter.dataset.filterInitialized = "true";
            filter.addEventListener('change', applySpeakerFilters);
        }
    });

    applySpeakerFilters();
}

window.initSpeakers = initSpeakers;
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSpeakers);
} else {
    initSpeakers();
}