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
        .map(f => `location-${f.id}`); // Corrected map to match class names

    const speakers = document.querySelectorAll('.speaker');
    const mapRegions = document.querySelectorAll('.map-region'); // Assuming mapRegions have classes like 'location-prague'

    speakers.forEach(speaker => {
        const speakerName = speaker.querySelector('.speaker-name')?.textContent.toLowerCase() || '';
        const matchesSearch = speakerName.includes(searchValue);
        const matchesLocation =
            activeFilters.length === 0 ||
            activeFilters.some(filterClass => speaker.classList.contains(filterClass));

        speaker.style.display = (matchesSearch && matchesLocation) ? 'flex' : 'none';
    });

    mapRegions.forEach(region => {
        if (activeFilters.length === 0) {
            region.style.fill = 'var(--accent)';
        } else {
            const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
            region.style.fill = hasMatch ? 'var(--accent)' : 'var(--accent20)';
        }
    });
}

// Attach event listeners
if (speakerSearch) {
    speakerSearch.addEventListener('input', applySpeakerFilters);
}

locationFilters.forEach(filter => {
    filter.addEventListener('change', applySpeakerFilters);
});