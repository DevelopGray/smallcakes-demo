// Direction A — demo interactions (build here).
// "Acts like it works" without real backends: order handoff modal, custom
// form steps + fake reference #, flavor rotation, directions, etc.

// Analytics stub — mirrors the event taxonomy from RESEARCH_NOTES.md so the
// demo can prove intent in the console instead of hitting a real endpoint.
function track(event, detail = {}) {
  console.log(`[demo:A] ${event}`, detail);
}

// ponytail: no framework, no bundler — plain DOM. Wire handlers as sections land.
document.addEventListener('DOMContentLoaded', () => {
  track('page_view', { direction: 'a-pink-box' });
});
