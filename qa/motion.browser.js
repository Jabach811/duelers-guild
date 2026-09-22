// Execute with cua_repl and the existing local tab, never a second automation runner.
// Removing the pause handler or ignoring reduced-motion must fail these checks.
async function verifyMotionPause(tab) {
  const pause = tab.playwright.getByRole('button', {name:'Pause motion',exact:true});
  if (await pause.count() !== 1) throw new Error('The animated site must expose one reachable pause control.');
  await pause.click();
  if (await tab.playwright.locator('html').getAttribute('data-motion') !== 'paused') throw new Error('Pause must disable the animated experience.');
  const resume = tab.playwright.getByRole('button',{name:'Resume motion',exact:true});
  if (await resume.count() !== 1) throw new Error('Pausing must expose a way to resume.');
  return true;
}

// Fixture: phone viewport, a loaded page with motion active and local Shop navigation.
async function verifyMotionAfterNavigation(tab) {
  await tab.playwright.getByRole('button',{name:'Pause motion',exact:true}).click();
  await tab.playwright.getByRole('button',{name:'Menu',exact:true}).click();
  await tab.playwright.expectNavigation(()=>tab.playwright.getByRole('link',{name:'Shop',exact:true}).click(),{waitUntil:'load'});
  if (await tab.playwright.locator('h1').innerText() !== 'Find your next game.') throw new Error('Expected the new Shop document.');
  await tab.playwright.getByRole('button',{name:'Resume motion',exact:true}).click();
  if (await tab.playwright.locator('html').getAttribute('data-motion') !== 'active') throw new Error('Motion control must respond immediately after navigation.');
  return true;
}

async function verifyMotionUnderDialog(tab) {
  await tab.playwright.getByRole('button',{name:'Read the condition guide',exact:true}).click();
  const state = await tab.playwright.evaluate(()=>getComputedStyle(document.querySelector('.ribbon-track')).animationPlayState);
  await tab.playwright.locator('.dialog-close').click();
  if (state !== 'paused') throw new Error('Background ribbon must stop while the modal guide is open.');
  return true;
}
