(function() {
  // Use unique variable names to avoid any global conflicts
  const myJobRoles = ["data scientist", "machine learning", "analyst", "business analyst", "ai", "ml", "python", "data"];
  const jobRoleRegex = new RegExp(`\\b(${myJobRoles.join('|')})\\w*\\b`, 'gi');

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }

  function highlightJobRoles() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;

    while (node = walker.nextNode()) {
      const parent = node.parentElement;
      
      if (!parent || parent.classList.contains('role-highlight') || 
          ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
        continue;
      }

      if (jobRoleRegex.test(node.nodeValue)) {
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(jobRoleRegex, '<mark class="role-highlight">$&</mark>');
        node.parentNode.replaceChild(span, node);
      }
    }
  }

  // Initial execution
  highlightJobRoles();

  // Use a unique name for the observer instance
  const gmailRoleObserver = new MutationObserver(debounce(() => {
    highlightJobRoles();
  }, 500));

  gmailRoleObserver.observe(document.body, { childList: true, subtree: true });
})();