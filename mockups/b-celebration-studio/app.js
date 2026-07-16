// Direction B — demo interactions (build here).
function track(event, detail = {}) {
  console.log(`[demo:B] ${event}`, detail);
}
document.addEventListener('DOMContentLoaded', () => {
  track('page_view', { direction: 'b-celebration-studio' });
});
