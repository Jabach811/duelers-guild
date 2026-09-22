// Run in cua_repl with qaTab bound to the existing local development tab.
// Fixture: save Catalyst Stone from its detail page, then visit /wishlist/.
// Catches state synchronization happening before newly rendered buttons exist.
async function verifySavedToggle(qaTab) {
  const state = await qaTab.playwright.locator('[data-save="8063"]').getAttribute('aria-pressed');
  if (state !== 'true') throw new Error(`Saved-products entry must be pressed; received ${state}`);
  return true;
}
