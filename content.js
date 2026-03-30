(function() {
  // 1. Bi-directional Regex: Matches "not sponsorship" OR "sponsorship is not"
  const coreTerms = ["sponsorship", "visa", "citizen", "resident", "green card", "clearance"];
  const negations = ["no", "not", "unable", "cannot", "don't", "doesn't", "won't", "restricted"];
  
  const smartRegex = new RegExp(
    `\\b(?:(${negations.join('|')})\\s*(?:\\w+\\s*){0,3}(${coreTerms.join('|')})|(${coreTerms.join('|')})\\s*(?:\\w+\\s*){0,3}(${negations.join('|')}))\\b`, 
    'gi'
  );

  // 2. Initialize the Indicator ONLY if document.body exists (The Null Check)
  if (document.body && !document.getElementById('sponsorship-scout-indicator')) {
    const indicator = document.createElement('div');
    indicator.id = 'sponsorship-scout-indicator';
    indicator.title = "Click to jump to restrictive terms";
    
    indicator.addEventListener('click', () => {
      const firstHighlight = document.querySelector('.sponsorship-highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    
    document.body.appendChild(indicator);
  }

  function scanNode(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
    let node;
    let found = false;

    while (node = walker.nextNode()) {
      const parent = node.parentElement;
      const text = node.nodeValue;

      // Filter: Skip if already highlighted, non-visual, or looks like a question
      if (!parent || parent.classList.contains('sponsorship-highlight') || 
          ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName) ||
          /[?]$/.test(text.trim()) || /^(Would|Will|Do|Can)/i.test(text.trim())) {
        continue;
      }

      if (smartRegex.test(text)) {
        found = true;
        const span = document.createElement('span');
        span.innerHTML = text.replace(smartRegex, '<mark class="sponsorship-highlight">$&</mark>');
        node.parentNode.replaceChild(span, node);
      }
    }
    return found;
  }

  function scanAndHighlight() {
    // Safety check: Exit if we aren't on a standard HTML page
    if (!document.body) return;

    let globalMatch = scanNode(document.body);

    // Deep dive into Shadow DOM (Required for Eightfold.ai / John Deere)
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.shadowRoot) {
        if (scanNode(el.shadowRoot)) globalMatch = true;
      }
    });

    const indicator = document.getElementById('sponsorship-scout-indicator');
    if (indicator) {
      if (globalMatch || document.querySelector('.sponsorship-highlight')) {
        indicator.classList.add('indicator-danger');
      } else {
        indicator.classList.remove('indicator-danger');
      }
    }
  }

  // 3. Execution and Observer
  scanAndHighlight();

  const debounce = (func, timeout = 500) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  };

  const scoutObserver = new MutationObserver(debounce(scanAndHighlight, 500));
  if (document.body) {
    scoutObserver.observe(document.body, { childList: true, subtree: true });
  }
})();