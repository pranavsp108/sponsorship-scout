// Optimized to find negative statements while ignoring neutral questions
const coreTerms = ["sponsorship", "visa", "citizen", "resident", "green card", "clearance"];
const negations = ["no", "not", "unable", "cannot", "don't", "doesn't", "won't", "restricted"];

// This regex specifically looks for Negation + Term (e.g., "no sponsorship" or "doesn't offer visa")
// It avoids triggering on sentences that start with "Would you" or "Will you"
const smartRegex = new RegExp(`\\b(${negations.join('|')})\\s*(?:\\w+\\s*){0,3}(${coreTerms.join('|')})`, 'gi');


// 1. Debounce function to limit scanner frequency
function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

// 2. Initialize Indicator with Click-to-Scroll logic
if (!document.getElementById('sponsorship-scout-indicator')) {
  const indicator = document.createElement('div');
  indicator.id = 'sponsorship-scout-indicator';
  indicator.title = "Click to jump to sponsorship details";
  
  indicator.addEventListener('click', () => {
    // Finds the first highlight on the current page
    const firstHighlight = document.querySelector('.sponsorship-highlight');
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  document.body.appendChild(indicator);
}

function scanAndHighlight() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  let matchesFound = false;

  while (node = walker.nextNode()) {
    const parent = node.parentElement;
    
    // Skip already highlighted nodes or non-visual tags
    if (!parent || parent.classList.contains('sponsorship-highlight') || 
        ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
      continue;
    }

    if (smartRegex.test(node.nodeValue)) {
      matchesFound = true;
      const span = document.createElement('span');
      // Wraps negative statements in the light red mark
      span.innerHTML = node.nodeValue.replace(smartRegex, '<mark class="sponsorship-highlight">$&</mark>');
      node.parentNode.replaceChild(span, node);
    }
  }

  // Visual Indicator Logic
  const indicator = document.getElementById('sponsorship-scout-indicator');
  if (indicator) {
    // Check for existing highlights or new matches from this pass
    if (matchesFound || document.querySelector('.sponsorship-highlight')) {
      indicator.classList.add('indicator-danger');
    } else {
      // CRITICAL: Remove the red dot if no negative statements are present
      indicator.classList.remove('indicator-danger');
    }
  }
}

// 3. Initial execution and Observer setup
scanAndHighlight();

const debouncedScan = debounce(scanAndHighlight, 500);
const observer = new MutationObserver(() => {
  debouncedScan();
});

observer.observe(document.body, { childList: true, subtree: true });