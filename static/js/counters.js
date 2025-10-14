// Content for /js/sheets-progress-bar.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const registrationInfoDiv = document.getElementById('registration-info');
    const sheetUrl = registrationInfoDiv ? registrationInfoDiv.dataset.sheetUrl : null;
    const targetCount = 150; // Max registration value

    // --- Element References ---
    const progressBarTrack = registrationInfoDiv ? registrationInfoDiv.querySelector('.progress-bar-track-pill') : null;
    const progressBarFill = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-fill-pill') : null;
    const progressBarCountText = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-count-text') : null;
    // New: Reference to the bento text element
    const bentoRegistrationText = document.getElementById('bento-registration-text');


    // --- Validation ---
    if (!registrationInfoDiv || !progressBarTrack || !progressBarFill || !progressBarCountText || !bentoRegistrationText) {
        console.error("Required progress bar HTML elements not found (#registration-info, .progress-bar-track-pill, .progress-bar-fill-pill, .progress-bar-count-text, or #bento-registration-text).");
        if(registrationInfoDiv) registrationInfoDiv.textContent = 'Error loading progress bar.';
        return;
    }

    if (!sheetUrl || sheetUrl.trim() === '') {
        console.error("Google Sheet URL not provided or is empty in data-sheet-url attribute on #registration-info.");
        progressBarCountText.textContent = `Error: URL missing.`;
        if(progressBarFill) progressBarFill.style.backgroundColor = 'red';
        if(progressBarTrack) {
            progressBarTrack.style.backgroundColor = 'transparent';
            progressBarTrack.style.boxShadow = 'none';
            progressBarTrack.style.overflow = 'visible';
            progressBarTrack.style.height = 'auto';
            progressBarTrack.style.padding = '0';
            progressBarTrack.style.borderRadius = '0';
        }
        progressBarCountText.style.color = 'red';
        progressBarCountText.style.position = 'static';
        progressBarCountText.style.textAlign = 'center';
        progressBarCountText.style.width = '100%';
        progressBarCountText.style.transform = 'none';
        // Set bento text to error state as well
        bentoRegistrationText.textContent = `Chyba načítání`;
        return;
    }

    if (typeof targetCount !== 'number' || targetCount <= 0) {
        console.error("Invalid targetCount specified. Must be a positive number.");
        progressBarCountText.textContent = `Error: Invalid target.`;
        if(progressBarFill) progressBarFill.style.backgroundColor = 'red';
        if(progressBarTrack) {
            progressBarTrack.style.backgroundColor = 'transparent';
            progressBarTrack.style.boxShadow = 'none';
            progressBarTrack.style.overflow = 'visible';
            progressBarTrack.style.height = 'auto';
            progressBarTrack.style.padding = '0';
            progressBarTrack.style.borderRadius = '0';
        }
        progressBarCountText.style.color = 'red';
        progressBarCountText.style.position = 'static';
        progressBarCountText.style.textAlign = 'center';
        progressBarCountText.style.width = '100%';
        progressBarCountText.style.transform = 'none';
        // Set bento text to error state as well
        bentoRegistrationText.textContent = `Chyba cílové hodnoty`;
        return;
    }

    // --- Helper Functions ---

    function getSheetIds(url) {
        try {
            const urlObj = new URL(url);
            const pathSegments = urlObj.pathname.split('/d/');
            if (pathSegments.length < 2) throw new Error("Invalid URL path for sheet ID.");
            const sheetId = pathSegments[1].split('/edit')[0];
            if (!sheetId) throw new Error("Sheet ID extraction failed.");

            const gid = urlObj.searchParams.get('gid');
            if (!gid) {
                const fragmentGidMatch = urlObj.hash.match(/#gid=(\d+)/);
                if (fragmentGidMatch && fragmentGidMatch[1]) {
                    return { sheetId: sheetId, gid: fragmentGidMatch[1] };
                } else {
                    throw new Error("GID not found in URL query parameters or fragment.");
                }
            }
            return { sheetId: sheetId, gid: gid };
        } catch (e) {
            console.error("Failed to parse sheet URL:", e.message, url);
            return null;
        }
    }

    function getCsvExportUrl(sheetId, gid) {
        return `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`;
    }

    /**
     * Fetches CSV data, counts lines, calculates progress, and updates the bar and text.
     * @param {string} csvUrl - The URL of the public CSV data.
     * @param {number} target - The target count for 100% progress.
     * @param {HTMLElement} fillElement - The HTML element for the fill bar.
     * @param {HTMLElement} textElement - The HTML element for the count text.
     * @param {HTMLElement} bentoTextElement - The HTML element for the bento board item text.
     */
    async function fetchLineCountAndAnimateBar(csvUrl, target, fillElement, textElement, bentoTextElement) {
        textElement.textContent = `Načítám...`; // Loading text in the count area
        textElement.style.justifyContent = 'flex-end';
        textElement.style.left = 'auto';
        textElement.style.right = '15px';
        textElement.style.width = 'auto';
        fillElement.style.width = '0%';
        bentoTextElement.textContent = 'účastníků'; // Default bento text


        try {
            const response = await fetch(csvUrl);

            if (!response.ok) {
                textElement.textContent = `Error (${response.status})`;
                console.error(`HTTP error! status: ${response.status} from ${csvUrl}`);
                fillElement.style.backgroundColor = 'red';
                fillElement.style.width = '100%';
                textElement.style.color = 'white';
                textElement.style.justifyContent = 'center';
                textElement.style.left = '0';
                textElement.style.right = '0';
                textElement.style.width = '100%';
                bentoTextElement.textContent = `Chyba načítání`; // Update bento text on error
                return;
            }

            const csvText = await response.text();
            const lines = csvText.split(/\r\n|\n|\r/);
            const lineCount = lines.length > 0 && lines[0].trim() !== '' ? lines.length - 1 : 0;

            let percentage = (lineCount / target) * 100;
            if (percentage > 100) percentage = 100;
            if (percentage < 0) percentage = 0;

            // --- Update HTML and Animate Bar ---
            textElement.textContent = `${lineCount}/${target}`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fillElement.style.width = `${percentage}%`;
                });
            });

            // Add the "nice effect" when max registration is reached
            if (lineCount >= target) {
                fillElement.style.backgroundColor = 'var(--accent-full)';
                fillElement.style.boxShadow = '0 0 15px var(--accent-full)';
                fillElement.classList.add('registration-full-pulse');

                textElement.textContent = `Registrace plná!`;
                textElement.style.fontWeight = 'bold';
                textElement.style.color = 'white';
                textElement.style.justifyContent = 'center';
                textElement.style.left = '0';
                textElement.style.right = '0';
                textElement.style.width = '100%';

                // New: Change the bento text
                bentoTextElement.textContent = `Všech ${targetCount} míst obsazeno!`; // Or whatever you prefer
            } else {
                // Reset styles if the count drops below the target
                fillElement.style.backgroundColor = '';
                fillElement.style.boxShadow = '';
                fillElement.classList.remove('registration-full-pulse');
                textElement.style.fontWeight = '';
                textElement.style.color = '';
                textElement.style.justifyContent = 'flex-end';
                textElement.style.left = 'auto';
                textElement.style.right = '15px';
                textElement.style.width = 'auto';

                // New: Reset the bento text
                bentoTextElement.textContent = `účastníků`;
            }

        } catch (error) {
            console.error("Failed to fetch or process CSV data:", error);
            textElement.textContent = `Chyba`;
            fillElement.style.backgroundColor = 'red';
            fillElement.style.width = '100%';
            textElement.style.color = 'white';
            textElement.style.justifyContent = 'center';
            textElement.style.left = '0';
            textElement.style.right = '0';
            textElement.style.width = '100%';
            bentoTextElement.textContent = `Chyba načítání`; // Update bento text on error
        }
    }

    // --- Main Execution ---

    const ids = getSheetIds(sheetUrl);

    if (ids) {
        const csvUrl = getCsvExportUrl(ids.sheetId, ids.gid);
        // Pass the new bentoTextElement to the fetch function
        fetchLineCountAndAnimateBar(csvUrl, targetCount, progressBarFill, progressBarCountText, bentoRegistrationText);
    } else {
        progressBarCountText.textContent = `Neplatná URL`;
        if (progressBarFill) {
            progressBarFill.style.backgroundColor = 'red';
            progressBarFill.style.width = '100%';
        }
        progressBarCountText.style.color = 'white';
        progressBarCountText.style.position = 'static';
        progressBarCountText.style.textAlign = 'center';
        progressBarCountText.style.width = '100%';
        progressBarCountText.style.transform = 'none';

        if (progressBarTrack) {
            progressBarTrack.style.backgroundColor = 'transparent';
            progressBarTrack.style.boxShadow = 'none';
            progressBarTrack.style.overflow = 'visible';
            progressBarTrack.style.height = 'auto';
            progressBarTrack.style.padding = '0';
            progressBarTrack.style.borderRadius = '0';
        }
        // Update bento text on URL error
        bentoRegistrationText.textContent = `Chyba URL`;
    }

    const eventTime = new Date(eventTimeStr).getTime();
    const countdownEl = document.getElementById("countdown-display");
    
    function updateCountdown() {
      const now = new Date().getTime();
      const diff = eventTime - now;         
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
    
      countdownEl.innerHTML = `
        <div class="countdown-row">
            <div class="countdown-block">
            <span class="count-number">${d}</span>
            <span class="count-label">dnů</span>
            </div>
            <span class="count-separator">:</span>
            <div class="countdown-block">
            <span class="count-number">${h}</span>
            <span class="count-label">hodin</span>
            </div>
            <span class="count-separator">:</span>
            <div class="countdown-block">
            <span class="count-number">${m}</span>
            <span class="count-label">minut</span>
            </div>
            <span class="count-separator">:</span>
            <div class="countdown-block">
            <span class="count-number">${s}</span>
            <span class="count-label">sekund</span>
            </div>
        </div>
        `;
    }
    
    setInterval(updateCountdown, 1000);  // Aktualizace každou sekundu
  });