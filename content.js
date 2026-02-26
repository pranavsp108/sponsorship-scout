// 1. Create the Indicator Element on the page
const indicator = document.createElement('div');
indicator.id = 'sponsorship-scout-indicator';
indicator.title = "Sponsorship/Citizenship terms detected below!";
document.body.appendChild(indicator);

const coreTerms = ["sponsorship", "visa", "citizen", "resident", "green card"];
const qualifiers = ["no", "not", "unable", "cannot", "don't", "doesn't", "must be", "require"];
const smartRegex = new RegExp(`\\b(${qualifiers.join('|')})\\s*(?:\\w+\\s*){0,3}(${coreTerms.join('|')})|(${coreTerms.join('|')})\\s*(?:\\w+\\s*){0,3}(${qualifiers.join('|')})`, 'gi');

function checkForSponsorship(node) {
  let foundMatch = false;

  function walk(node) {
    if (node.nodeType === 3) {
      if (smartRegex.test(node.nodeValue)) {
        foundMatch = true;
        const span = document.createElement('span');
        span.innerHTML = node.nodeValue.replace(smartRegex, '<mark class="sponsorship-highlight">$&</mark>');
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === 1 && node.childNodes) {
      for (let i = 0; i < node.childNodes.length; i++) {
        walk(node.childNodes[i]);
      }
    }
  }

  walk(node);

  // If a match was found anywhere, show the Red Dot
  if (foundMatch) {
    indicator.classList.add('indicator-danger');
  }
}

// Initialize
checkForSponsorship(document.body);

// Watch for dynamic content (like clicking "Show More" or infinite scroll)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) checkForSponsorship(node);
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });