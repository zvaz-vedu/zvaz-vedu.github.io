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

const speakerSearch = document.getElementById('speaker-search');
const locationFilters = document.querySelectorAll('.speaker-filters-container input[type="checkbox"]');
const mapRegions = document.querySelectorAll('.map-region');

function applySpeakerFilters() {
    const searchValue = speakerSearch ? speakerSearch.value.toLowerCase() : '';
    
    // Zjistíme, které filtry jsou momentálně zaškrtnuté
    const activeFilters = Array.from(locationFilters)
        .filter(f => f.checked)
        .map(f => {
            let id = f.id.toLowerCase(); 
            return id.startsWith('location-') ? id : `location-${id}`;
        });

    const speakers = document.querySelectorAll('.speaker');

    // Výchozí stav (žádný filtr nevybrán) nebo všechna města vybrána -> zobrazit všechny řečníky
    const isAllOrNone = activeFilters.length === 0 || activeFilters.length === locationFilters.length;

    // 1. Filtrace řečníků
    speakers.forEach(speaker => {
        const speakerName = speaker.querySelector('.speaker-name')?.textContent.toLowerCase() || '';
        const matchesSearch = speakerName.includes(searchValue);
        
        const matchesLocation =
            isAllOrNone ||
            activeFilters.some(filterClass => speaker.classList.contains(filterClass));

        speaker.style.display = (matchesSearch && matchesLocation) ? 'flex' : 'none';
    });

    // 2. Obarvování mapy
    if (mapRegions) {
        mapRegions.forEach(region => {
            if (isAllOrNone) {
                // Výchozí stav nebo všechna města zaškrtnuta -> svítí všechny aktivní regiony
                region.style.fill = 'var(--accent)';
            } else {
                const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
                region.style.fill = hasMatch ? 'var(--accent)' : 'var(--black-zv)';
            }
        });
    }
}

// Navěšení posluchačů událostí
if (speakerSearch) {
    speakerSearch.addEventListener('input', applySpeakerFilters);
}

locationFilters.forEach(filter => {
    filter.addEventListener('change', applySpeakerFilters);
});

// Propojení klikání na mapu s filtry měst
if (mapRegions) {
    mapRegions.forEach(region => {
        region.style.cursor = 'pointer';
        region.addEventListener('click', () => {
            const matchingFilter = Array.from(locationFilters).find(filter => {
                let id = filter.id.toLowerCase();
                let filterClass = id.startsWith('location-') ? id : `location-${id}`;
                return region.classList.contains(filterClass);
            });
            if (matchingFilter) {
                matchingFilter.checked = !matchingFilter.checked;
                applySpeakerFilters();
            }
        });
    });
}

// Spustit při načtení stránky
applySpeakerFilters();