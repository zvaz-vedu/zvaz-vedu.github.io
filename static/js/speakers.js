// --- JS Block 1: Reveal Button Toggle ---
document.getElementById('speakers-container').addEventListener('click', event => {
    const revealButton = event.target.closest('.reveal-button');
    if (!revealButton) return;

    const speakerBio = revealButton.closest('.speaker-bio');
    if (!speakerBio) return;

    const text = speakerBio.querySelector('.speaker-bio-text');
    const label = revealButton.querySelector('.reveal-button-label');
    const icon = revealButton.querySelector('i');

    const isHidden = text.style.display === 'none' || text.style.display === '';

    // The logic is unchanged
    text.style.display = isHidden ? 'block' : 'none';
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    label.textContent = isHidden ? 'Méně' : 'Více';
});

// --- JS Block 2: Search and Location Filtering ---
const speakerSearch = document.getElementById('speaker-search');
const locationFilters = document.querySelectorAll('.speaker-filters-container input');

function applySpeakerFilters() {
    const searchValue = speakerSearch.value.toLowerCase();
    
    const activeFilters = Array.from(locationFilters)
        .filter(f => f.checked)
        .map(f => {
            // 1. Force lowercase to match Hugo's ($loc | lower)
            let id = f.id.toLowerCase(); 
            // 2. Ensure "location-" prefix exists, but don't add it twice
            return id.startsWith('location-') ? id : `location-${id}`;
        });

    const speakers = document.querySelectorAll('.speaker');
    const mapRegions = document.querySelectorAll('.map-region'); 

    speakers.forEach(speaker => {
        // Search Logic
        const speakerName = speaker.querySelector('.speaker-name')?.textContent.toLowerCase() || '';
        const matchesSearch = speakerName.includes(searchValue);
        
        // Location Logic
        // We check if the speaker has ANY of the active filter classes
        const matchesLocation =
            activeFilters.length === 0 ||
            activeFilters.some(filterClass => speaker.classList.contains(filterClass));

        // Toggle Display
        speaker.style.display = (matchesSearch && matchesLocation) ? 'flex' : 'none';
    });

    // Map Region Logic
    if (mapRegions) {
        mapRegions.forEach(region => {
            if (activeFilters.length === 0) {
                region.style.fill = 'var(--accent)';
            } else {
                // Ensure region checking also respects the standardized class names
                const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
                region.style.fill = hasMatch ? 'var(--accent)' : 'var(--accent20)';
            }
        });
    }
}

// Attach event listeners
if (speakerSearch) {
    speakerSearch.addEventListener('input', applySpeakerFilters);
}

locationFilters.forEach(filter => {
    filter.addEventListener('change', applySpeakerFilters);
});