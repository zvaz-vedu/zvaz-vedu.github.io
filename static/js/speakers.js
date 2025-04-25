fetch('/json/speakers.json')
    .then(response => response.json())
    .then(speakers => {
        const container = document.getElementById('speakers-container');
        const template = document.getElementById('speaker-template');

        speakers.forEach(speaker => {
            const clone = template.content.cloneNode(true);

            const speakerElement = clone.querySelector('.speaker');

            // --- NEW PART: Calculate and set the ID ---
            // Get the speaker name from the JSON data
            const speakerName = speaker.name;
            // Calculate the ID: lowercase, replace spaces with hyphens
            const speakerId = speakerName.toLowerCase().replace(/ /g, '-');
            // Set the id attribute on the main speaker div
            speakerElement.id = speakerId;
            // --- END NEW PART ---


            if (speaker.locations && Array.isArray(speaker.locations)) {
                const locationClasses = speaker.locations.map(location => `location-${location.toLowerCase()}`);
                speakerElement.classList.add(...locationClasses);
            }

            clone.querySelector('.speaker-photo').src = speaker.photo;
            clone.querySelector('.speaker-photo').alt = speaker.name;
            clone.querySelector('.speaker-name').textContent = speaker.name;
            clone.querySelector('.speaker-bio-text').textContent = speaker.bio;

            const lectureList = clone.querySelector('.speaker-lectures');
            if (speaker.lectures && Array.isArray(speaker.lectures)) { // Added check for lectures array
                 speaker.lectures.forEach(lecture => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = lecture.youtube;
                    a.textContent = lecture.title;
                    a.target = "_blank";
                    li.appendChild(a);
                    lectureList.appendChild(li);
                 });
            } else {
                 // Optional: Hide lectures section if no lectures
                 const lecturesSection = lectureList.closest('div'); // Assuming lectures are in a div like in template
                 if (lecturesSection) lecturesSection.remove();
            }


            const contacts = clone.querySelector('.speaker-contacts');
            let contactsPresent = false; // Flag to check if any contact links are added
            ['website', 'instagram', 'linkedin', 'facebook'].forEach(key => {
                const link = clone.querySelector(`.${key}`);
                if (speaker.contact && speaker.contact[key]) {
                    link.href = speaker.contact[key];
                    contactsPresent = true;
                } else {
                    link.remove();
                }
            });
            if (!contactsPresent) { // Check the flag instead of child count
                 contacts.remove();
            }

            if (!speaker.bio) {
                const speakerBio = clone.querySelector('.speaker-bio');
                if (speakerBio) speakerBio.remove(); // Added check
            }

            container.appendChild(clone);
        });
    });


// --- Rest of your JavaScript code (reveal button, search, filters) ---
// This part should work fine as it targets elements by class or ID after they are added to the DOM.

document.getElementById('speakers-container').addEventListener('click', event => {
    const revealButton = event.target.closest('.reveal-button');
    if (!revealButton) return;

    const speakerBio = revealButton.closest('.speaker-bio');
    if (!speakerBio) return;

    const text = speakerBio.querySelector('.speaker-bio-text');
    const label = revealButton.querySelector('.reveal-button-label');
    const icon = revealButton.querySelector('i');

    // Check the actual computed style or a class for state management
    const isHidden = text.style.display === 'none' || !text.style.display; // Improved check

    text.style.display = isHidden ? 'block' : 'none';
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
    label.textContent = isHidden ? 'Méně' : 'Více';
});

const speakerSearch = document.getElementById('speaker-search');
// Check if speakerSearch element exists before adding listener
if (speakerSearch) {
    speakerSearch.addEventListener('input', () => {
        const searchValue = speakerSearch.value.toLowerCase();
        const speakers = document.querySelectorAll('.speaker'); // Select all speakers
        speakers.forEach(speaker => {
            const speakerNameElement = speaker.querySelector('.speaker-name');
            if (!speakerNameElement) return; // Skip if name element not found

            const speakerName = speakerNameElement.textContent.toLowerCase();
            // Also check if the speaker is currently hidden by filters to avoid conflicts
            const isFilteredOutByLocation = speaker.style.display === 'none' && !speaker.classList.contains('location-filter-match'); // Example check, adjust based on filter logic
            if (speakerName.includes(searchValue) && !isFilteredOutByLocation) {
                speaker.style.display = 'flex';
            } else {
                // Only hide if not a search match AND it's not supposed to be shown by filters
                 if (!speakerName.includes(searchValue)) { // If not a search match
                      // Check if it would be visible based on active filters
                      const activeFilters = Array.from(document.querySelectorAll('.speaker-filters-container input:checked'))
                                           .map(f => f.id);
                      const isVisibleByFilter = activeFilters.length === 0 || activeFilters.some(filterClass => speaker.classList.contains(filterClass));

                      if (!isVisibleByFilter) {
                         speaker.style.display = 'none';
                      } else if (speakerName.includes(searchValue)) {
                         // If it matches search AND should be visible by filter, show it
                         speaker.style.display = 'flex';
                      }
                      // This interaction between search and filters can get complex.
                      // A common approach is to have a single function that applies ALL current filters (search + location).
                 } else {
                      // If it matches search, ensure it's visible (unless filters prevent it - see complexity note above)
                      speaker.style.display = 'flex';
                 }
            }
        });
    });
}


const locationFilters = document.querySelectorAll('.speaker-filters-container input');
locationFilters.forEach(filter => {
    filter.addEventListener('change', () => {
        const activeFilters = Array.from(locationFilters)
            .filter(f => f.checked)
            .map(f => f.id); // Assuming filter ID is the location class suffix, e.g., "location-brno"

        const speakers = document.querySelectorAll('.speaker');
        const mapRegions = document.querySelectorAll('.map-region'); // Assuming map regions exist and have location classes

        speakers.forEach(speaker => {
            const speakerNameElement = speaker.querySelector('.speaker-name'); // Get name for potential search integration later
            if (!speakerNameElement) return;

            // Check visibility based on filters
            let isVisibleByFilter = false;
            if (activeFilters.length === 0) {
                isVisibleByFilter = true;
            } else {
                isVisibleByFilter = activeFilters.some(filterId => speaker.classList.contains(filterId));
            }

            // --- Integration with search ---
            // Get current search value
            const searchValue = speakerSearch ? speakerSearch.value.toLowerCase() : '';
            const matchesSearch = searchValue === '' || speakerNameElement.textContent.toLowerCase().includes(searchValue);
            // --- End Integration with search ---

            // Element is visible only if it matches filters AND search criteria
            if (isVisibleByFilter && matchesSearch) {
                 speaker.style.display = 'flex';
            } else {
                 speaker.style.display = 'none';
            }
        });

        // Update map regions based on active filters
        mapRegions.forEach(region => {
            let isMatch = false;
             if (activeFilters.length === 0) {
                 isMatch = true;
             } else {
                 isMatch = activeFilters.some(filterId => region.classList.contains(filterId));
             }
            region.style.fill = isMatch ? 'var(--accent)' : 'var(--accent20)';
        });
    });
});