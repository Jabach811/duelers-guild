(() => {
  const root = document.documentElement;
  const control = document.querySelector('[data-motion-control]');
  if (!control) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const wide = matchMedia('(min-width: 761px)');
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  const running = new Set();
  let paused = false;
  try { paused = localStorage.getItem('dg-preview-motion') === 'paused'; } catch {}
  const active = () => !reduced.matches && !paused;
  function animate(el,frames,options) {
    if (!active() || typeof el.animate !== 'function') return;
    const animation = el.animate(frames,options);
    running.add(animation);
    animation.onfinish = animation.oncancel = () => running.delete(animation);
  }
  function applyMode() {
    root.dataset.motion = reduced.matches ? 'reduced' : paused ? 'paused' : 'active';
    const label = reduced.matches ? 'Reduced motion' : paused ? 'Resume motion' : 'Pause motion';
    control.querySelector('span').textContent = label;
    control.setAttribute('aria-label',label);
    control.disabled = reduced.matches;
    control.hidden = false;
    if (!active()) {
      [...running].forEach(animation => animation.cancel());
      if (hero) { hero.style.removeProperty('--hero-x'); hero.style.removeProperty('--hero-y'); }
    }
    scheduleFrame();
  }
  control.addEventListener('click',() => {
    paused = !paused;
    try { localStorage.setItem('dg-preview-motion',paused ? 'paused' : 'active'); } catch {}
    applyMode();
  });
  reduced.addEventListener('change',applyMode);
  pointer.addEventListener('change',applyMode);
  wide.addEventListener('change',applyMode);
  window.addEventListener('storage',event => {
    if (event.key === 'dg-preview-motion') { paused = event.newValue === 'paused'; applyMode(); }
  });
  let frame = 0;
  let mouse = null;
  function scheduleFrame() { if (!frame) frame = requestAnimationFrame(updateFrame); }
  function updateFrame() {
    frame = 0;
    if (document.hidden) return;
    // Read geometry together, then write. No continuously running scroll loop.
    const range = root.scrollHeight - root.clientHeight;
    const progress = range > 0 ? Math.max(0,Math.min(1,window.scrollY / range)) : 0;
    const camera = hero && active() && pointer.matches && wide.matches;
    const rect = camera ? hero.getBoundingClientRect() : null;
    header?.style.setProperty('--reading-progress',progress);
    header?.classList.toggle('is-scrolled',window.scrollY > 12);
    if (rect && rect.bottom > 0 && rect.top < root.clientHeight) {
      const x = mouse ? Math.max(-.5,Math.min(.5,(mouse.x-rect.left)/rect.width-.5))*18 : 0;
      const y = (mouse ? Math.max(-.5,Math.min(.5,(mouse.y-rect.top)/rect.height-.5))*12 : 0) + Math.max(0,Math.min(1,-rect.top/rect.height))*28;
      hero.style.setProperty('--hero-x',`${x.toFixed(2)}px`);
      hero.style.setProperty('--hero-y',`${y.toFixed(2)}px`);
    }
  }
  window.addEventListener('scroll',scheduleFrame,{passive:true});
  window.addEventListener('resize',scheduleFrame,{passive:true});
  document.addEventListener('visibilitychange',() => {
    root.dataset.pageVisible = String(!document.hidden);
    if (!document.hidden) scheduleFrame();
  });
  root.dataset.pageVisible = String(!document.hidden);
  if (hero) {
    hero.addEventListener('pointermove',event => {
      if (!active() || !pointer.matches || !wide.matches) return;
      mouse = {x:event.clientX,y:event.clientY}; scheduleFrame();
    },{passive:true});
    hero.addEventListener('pointerleave',() => { mouse = null; scheduleFrame(); },{passive:true});
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
      root.dataset.heroVisible = String(entries[0].isIntersecting);
    }).observe(hero);
  }
  const ribbon = document.querySelector('.game-ribbon');
  if (ribbon && !ribbon.querySelector('.ribbon-track')) {
    const group = ribbon.querySelector('.wrap');
    if (group) {
      const track = document.createElement('div'); track.className = 'ribbon-track';
      const clone = group.cloneNode(true); clone.setAttribute('aria-hidden','true');
      ribbon.replaceChildren(track); track.append(group,clone);
    }
  }
  const observed = new WeakSet();
  const selector = '.section-heading,.play-copy,.sell-copy,.visit-copy,.visit-address,.page-heading,.game-hub,.product-detail,.game-entry,.product-card,.sell-steps > li,.play-options > article,.deckbuilder-panel,.collection-bar,.empty-state';
  function reveal(el,delay=0) {
    el.dataset.motionRevealed = 'true';
    const card = el.matches('.game-entry,.product-card');
    animate(el,[
      {opacity:0,transform:card ? 'translate(12px,26px) rotate(-1.2deg)' : 'translateY(18px)'},
      {opacity:1,transform:'none'}
    ],{duration:card ? 440 : 420,delay,easing:'cubic-bezier(.18,.75,.3,1)'});
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    let order = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target,Math.min(order++,3)*35);
    });
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'}) : null;
  function watch(scope) {
    const nodes = [...scope.querySelectorAll(selector)];
    if (scope.matches?.(selector)) nodes.unshift(scope);
    nodes.forEach(el => {
      if (observed.has(el)) return;
      observed.add(el);
      if (observer) observer.observe(el); else el.dataset.motionRevealed = 'true';
    });
  }
  applyMode();
  watch(document);
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => { if (node.nodeType === 1) watch(node); }));
    scheduleFrame();
  }).observe(document.querySelector('main') || document.body,{childList:true,subtree:true});
  if (hero) {
    [...hero.querySelectorAll('.hero-copy > *,.hero-image-caption')].forEach((el,i) => {
      animate(el,[{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'none'}],{duration:460,delay:i*35,easing:'cubic-bezier(.18,.75,.3,1)'});
    });
    const image = hero.querySelector('.hero-image');
    if (image && wide.matches) animate(image,[{opacity:.65,transform:'scale(1.14)'},{opacity:1,transform:'scale(1.08)'}],{duration:650,easing:'cubic-bezier(.18,.75,.3,1)'});
  }
  document.addEventListener('click',event => {
    if (!active() || !event.target.closest('[data-filter]')) return;
    requestAnimationFrame(() => {
      const cards = [...document.querySelectorAll('.game-entry:not([hidden])')];
      const visible = cards.filter(el => { const rect = el.getBoundingClientRect(); return rect.bottom > 0 && rect.top < root.clientHeight; });
      visible.forEach((el,i) => reveal(el,Math.min(i,3)*35));
    });
  });
})();
