(() => {
  const TITLE_SELECTOR = '[data-test-id="conversation-title"]';
  const DEFAULT_TITLE = "Google Gemini";

  let observer = null;
  let currentUrl = location.href;

  function updateTitle() {
    const el = document.querySelector(TITLE_SELECTOR);
    const text = el?.textContent?.trim();
    document.title = text || DEFAULT_TITLE;
  }

  function attachObserver() {
    if (observer) observer.disconnect();

    observer = new MutationObserver(updateTitle);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // Set title immediately in case the element is already present
    updateTitle();
  }

  function onNavigate() {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      updateTitle();
    }
  }

  // Attach on load
  attachObserver();

  // Gemini is a SPA — detect client-side navigation via popstate and periodic URL check
  window.addEventListener("popstate", onNavigate);

  // Override history methods to catch pushState / replaceState navigation
  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function (...args) {
      original.apply(this, args);
      onNavigate();
    };
  }
})();
