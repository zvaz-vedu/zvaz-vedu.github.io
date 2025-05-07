// Content for /js/sheets-progress-bar.js
document.addEventListener('DOMContentLoaded', function() {
    // --- Configuration ---
    const registrationInfoDiv = document.getElementById('registration-info');
    const sheetUrl = registrationInfoDiv ? registrationInfoDiv.dataset.sheetUrl : null;
    const targetCount = 150; // ** Set your target number here **
  
    // --- Element References ---
    const progressBarTrack = registrationInfoDiv ? registrationInfoDiv.querySelector('.progress-bar-track-pill') : null;
    const progressBarFill = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-fill-pill') : null; // Reference the fill div
    const progressBarCountText = progressBarTrack ? progressBarTrack.querySelector('.progress-bar-count-text') : null; // Reference the text span
  
    // --- Validation ---
    if (!registrationInfoDiv || !progressBarTrack || !progressBarFill || !progressBarCountText) {
      console.error("Required progress bar HTML elements not found (#registration-info, .progress-bar-track-pill, .progress-bar-fill-pill, or .progress-bar-count-text).");
       if(registrationInfoDiv) registrationInfoDiv.textContent = 'Error loading progress bar.';
      return;
    }
  
    if (!sheetUrl || sheetUrl.trim() === '') {
         console.error("Google Sheet URL not provided or is empty in data-sheet-url attribute on #registration-info.");
         progressBarCountText.textContent = `Error: URL missing.`; // Update text element
         // Style the track/fill to indicate error if needed
         if(progressBarFill) progressBarFill.style.backgroundColor = 'red';
         if(progressBarTrack) {
             progressBarTrack.style.backgroundColor = 'transparent';
             progressBarTrack.style.boxShadow = 'none';
             progressBarTrack.style.overflow = 'visible';
             progressBarTrack.style.height = 'auto';
             progressBarTrack.style.padding = '0';
             progressBarTrack.style.borderRadius = '0';
         }
         progressBarCountText.style.color = 'red'; // Ensure text is visible
         progressBarCountText.style.position = 'static'; // Remove absolute position for error text
         progressBarCountText.style.textAlign = 'center'; // Center error text
         progressBarCountText.style.width = '100%'; // Take full width
         progressBarCountText.style.transform = 'none'; // Remove any transforms
         return;
    }
  
     if (typeof targetCount !== 'number' || targetCount <= 0) {
         console.error("Invalid targetCount specified. Must be a positive number.");
         progressBarCountText.textContent = `Error: Invalid target.`; // Update text element
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
     */
    async function fetchLineCountAndAnimateBar(csvUrl, target, fillElement, textElement) {
      // Set initial loading state on the text element
      textElement.textContent = `Načítám...`; // Loading text in the count area
      fillElement.style.width = '0%'; // Start with 0% width
      // Reset fill background/color in case of previous errors
  
  
      try {
        const response = await fetch(csvUrl);
  
        if (!response.ok) {
          textElement.textContent = `Error (${response.status})`; // Concise error
          console.error(`HTTP error! status: ${response.status} from ${csvUrl}`);
           fillElement.style.backgroundColor = 'red'; // Error color for fill
           fillElement.style.width = '100%'; // Fill completely with error color
           textElement.style.color = 'white'; // Error text color
          return;
        }
  
        const csvText = await response.text();
        const lines = csvText.split(/\r\n|\n|\r/);
        const lineCount = lines.length > 0 && lines[0].trim() !== '' ? lines.length - 1 : 0;
  
        let percentage = (lineCount / target) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
  
        // --- Update HTML and Animate Bar ---
        // Update the text content with the count and target
        textElement.textContent = `${lineCount}/${target}`; // Example: "50/100"
  
        // Animate the bar width
         requestAnimationFrame(() => {
             requestAnimationFrame(() => {
                  fillElement.style.width = `${percentage}%`;
             });
         });
  
         // Adjust text color based on whether the fill covers it (optional advanced)
         // This is complex and might not be necessary with good contrasting colors and text shadow.
         // For now, the text color is static (var(--accent)) on the white fill.
  
      } catch (error) {
        console.error("Failed to fetch or process CSV data:", error);
        textElement.textContent = `Chyba`; // Concise error
        fillElement.style.backgroundColor = 'red'; // Error color for fill
        fillElement.style.width = '100%'; // Fill completely with error color
        textElement.style.color = 'white'; // Error text color
      }
    }
  
    // --- Main Execution ---
  
    const ids = getSheetIds(sheetUrl);
  
    if (ids) {
        const csvUrl = getCsvExportUrl(ids.sheetId, ids.gid);
        // Pass fill element and text element to the fetch function
        fetchLineCountAndAnimateBar(csvUrl, targetCount, progressBarFill, progressBarCountText);
    } else {
        // Handle case where IDs could not be extracted from the URL
        progressBarCountText.textContent = `Neplatná URL`; // Concise error
         // Style error state
         if (progressBarFill) {
             progressBarFill.style.backgroundColor = 'red';
             progressBarFill.style.width = '100%';
         }
         progressBarCountText.style.color = 'white';
         // Adjust text position for error if needed
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