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
const locationFilters = document.querySelectorAll('.speaker-filters-container input[type="checkbox"]');

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
    const mapRegions = document.querySelectorAll('.map-region'); 

    // 1. Filtrace řečníků
    speakers.forEach(speaker => {
        const speakerName = speaker.querySelector('.speaker-name')?.textContent.toLowerCase() || '';
        const matchesSearch = speakerName.includes(searchValue);
        
        const matchesLocation =
            activeFilters.length === 0 ||
            activeFilters.some(filterClass => speaker.classList.contains(filterClass));

        speaker.style.display = (matchesSearch && matchesLocation) ? 'flex' : 'none';
    });

    // 2. Obarvování mapy přes inline styly (jak jsi chtěl)
    if (mapRegions) {
        mapRegions.forEach(region => {
            if (activeFilters.length === 0) {
                // Výchozí stav (nic není zaškrtnuto)
                region.style.fill = 'var(--black-zv)'; // Zde dej barvu, když nic nesvítí
            } else {
                const hasMatch = activeFilters.some(filterClass => region.classList.contains(filterClass));
                // Zde se tahají tvé proměnné
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

// ZAVOLÁME IHNED PO NAČTENÍ, ABY MAPA REAGOVALA NA DEFAULTNĚ ZAŠKRTNUTÁ TLAČÍTKA
applySpeakerFilters();

// psalo gemi-ni tak sorry za chyby, ale to co bylo předtím tak psalo určitě taky