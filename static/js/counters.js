// Content for /js/sheets-progress-bar.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const registrationInfoDiv = document.getElementById('registration-info');
    const sheetUrl = registrationInfoDiv ? registrationInfoDiv.dataset.sheetUrl : null;
    
    const rawParticipants = registrationInfoDiv ? (registrationInfoDiv.dataset.maxParticipants || registrationInfoDiv.dataset.participants) : null;
    const targetCount = rawParticipants ? parseInt(rawParticipants, 10) : 100;

    // --- Element References ---
    const progressBarTrack = registrationInfoDiv ? registrationInfoDiv.querySelector('.progress-bar-track-pill') : null;
    const progressBarFill = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-fill-pill') : null;
    const progressBarCountText = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-count-text') : null;
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
        bentoRegistrationText.textContent = `Chyba načítání`;
        return;
    }

    // FIXED: Properly check for NaN instead of using typeof
    if (isNaN(targetCount) || targetCount <= 0) {
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
        bentoRegistrationText.textContent = `Chyba cílové hodnoty`;
        return;
    }

    // --- Helper Functions ---

    function getCsvExportUrl(url) {
        try {
            const urlObj = new URL(url);
            if (urlObj.pathname.endsWith('/pubhtml')) {
                urlObj.pathname = urlObj.pathname.replace('/pubhtml', '/pub');
            }
            urlObj.searchParams.set('output', 'csv');
            return urlObj.toString();
        } catch (e) {
            console.error("Failed to parse sheet URL:", e.message, url);
            return null;
        }
    }

    async function fetchLineCountAndAnimateBar(csvUrl, target, fillElement, textElement, bentoTextElement) {
        textElement.textContent = `Načítám...`; 
        textElement.style.justifyContent = 'flex-end';
        textElement.style.left = 'auto';
        textElement.style.right = '15px';
        textElement.style.width = 'auto';
        fillElement.style.width = '0%';
        bentoTextElement.textContent = 'účastníků'; 

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
                bentoTextElement.textContent = `Chyba načítání`; 
                return;
            }

            const csvText = await response.text();
            
            const firstLine = csvText.split(/\r\n|\n|\r/)[0];
            const a1ValueRaw = firstLine ? firstLine.split(',')[0] : "0";
            
            const participantCount = parseInt(a1ValueRaw.replace(/(^"|"$)/g, '').trim(), 10);

            if (isNaN(participantCount)) {
                throw new Error("Hodnota v buňce A1 není platné číslo.");
            }

            let percentage = (participantCount / target) * 100;
            if (percentage > 100) percentage = 100;
            if (percentage < 0) percentage = 0;

            // --- Update HTML and Animate Bar ---
            textElement.textContent = `${participantCount}/${target}`;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fillElement.style.width = `${percentage}%`;
                });
            });

            if (participantCount >= target) {
                fillElement.style.backgroundColor = 'var(--tertiary)';
                fillElement.style.boxShadow = '0 0 15px var(--accent)';
                fillElement.classList.add('registration-full-pulse');

                textElement.textContent = `Všech ${target} míst obsazeno!`;
                textElement.style.fontWeight = 'bold';
                textElement.style.color = 'white';
                textElement.style.justifyContent = 'center';
                textElement.style.left = '0';
                textElement.style.right = '0';
                textElement.style.width = '100%';

                bentoTextElement.textContent = `Děkujeme za velký zájem!`; 
            } else {
                fillElement.style.backgroundColor = '';
                fillElement.style.boxShadow = '';
                fillElement.classList.remove('registration-full-pulse');
                textElement.style.fontWeight = '';
                textElement.style.color = '';
                textElement.style.justifyContent = 'flex-end';
                textElement.style.left = 'auto';
                textElement.style.right = '15px';
                textElement.style.width = 'auto';

                bentoTextElement.textContent = `účastníků`;
            }

        } catch (error) {
            console.error("Failed to fetch or process data:", error);
            textElement.textContent = `Chyba`;
            fillElement.style.backgroundColor = 'red';
            fillElement.style.width = '100%';
            textElement.style.color = 'white';
            textElement.style.justifyContent = 'center';
            textElement.style.left = '0';
            textElement.style.right = '0';
            textElement.style.width = '100%';
            bentoTextElement.textContent = `Chyba načítání`; 
        }
    }

    // --- Main Execution ---
    const csvUrl = getCsvExportUrl(sheetUrl);

    if (csvUrl) {
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
        bentoRegistrationText.textContent = `Chyba URL`;
    }

    if (typeof eventTimeStr !== 'undefined') {
        const eventTime = new Date(eventTimeStr).getTime();
        const countdownEl = document.getElementById("countdown-display");
        
        function updateCountdown() {
          const now = new Date().getTime();
          const diff = eventTime - now;         
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
        
          if(countdownEl) {
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
        }
        
        setInterval(updateCountdown, 1000); 
    }
});