const coreTerms = ["sponsorship", "visa", "citizen", "resident", "green card", "clearance"];
const qualifiers = ["no", "not", "unable", "cannot", "don't", "doesn't", "must be", "require"];
const smartRegex = new RegExp(`\\b(${qualifiers.join('|')})\\s*(?:\\w+\\s*){0,3}(${coreTerms.join('|')})|(${coreTerms.join('|')})\\s*(?:\\w+\\s*){0,3}(${qualifiers.join('|')})`, 'gi');

// 1. Debounce function to limit how often the scanner runs
function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function scanAndHighlight() {
  // Use a TreeWalker: The most memory-efficient way to find text in the DOM
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;

  while (node = walker.nextNode()) {
    const parent = node.parentElement;
    
    // Skip if already highlighted or in a script/style tag
    if (!parent || parent.classList.contains('sponsorship-highlight') || 
        ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
      continue;
    }

    if (smartRegex.test(node.nodeValue)) {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(smartRegex, '<mark class="sponsorship-highlight">$&</mark>');
      node.parentNode.replaceChild(span, node);
      
      const indicator = document.getElementById('sponsorship-scout-indicator');
      if (indicator) indicator.classList.add('indicator-danger');
    }
  }
}

// 2. Initialize the Indicator once
if (!document.getElementById('sponsorship-scout-indicator')) {
  const indicator = document.createElement('div');
  indicator.id = 'sponsorship-scout-indicator';
  document.body.appendChild(indicator);
}

// 3. Run initial scan
scanAndHighlight();

// 4. Use the Debounced observer to handle dynamic content (LinkedIn/Workday)
const debouncedScan = debounce(scanAndHighlight, 500);
const observer = new MutationObserver(() => {
  debouncedScan();
});

observer.observe(document.body, { childList: true, subtree: true });