// Direction C — demo interactions (build here).
function track(event, detail = {}) {
  console.log(`[demo:C] ${event}`, detail);
}
document.addEventListener('DOMContentLoaded', () => {
  track('page_view', { direction: 'c-sweet-stop' });
});
