(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) setMenu(false); });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const entries = [...document.querySelectorAll('.game-entry')];
  const status = document.querySelector('#directory-status');
  function applyFilter(category, updateURL = false) {
    if (!['all', 'cards', 'tabletop'].includes(category)) category = 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
    let count = 0;
    entries.forEach(entry => {
      const kind = entry.dataset.kind || 'cards';
      const show = category === 'all' || category === kind;
      entry.hidden = !show;
      if (show) count++;
    });
    status.textContent = `${count} ${count === 1 ? 'category' : 'categories'}`;
    if (updateURL) {
      const url = new URL(window.location.href);
      if (category === 'all') url.searchParams.delete('category');
      else url.searchParams.set('category', category);
      window.history.replaceState(null, '', url);
    }
  }
  if (status) {
    filters.forEach(filter => filter.addEventListener('click', () => applyFilter(filter.dataset.filter, true)));
    applyFilter(new URLSearchParams(window.location.search).get('category') || 'all');
  }

  const guide = document.querySelector('#condition-guide');
  if (!guide) return;
  let guideOpener;
  document.querySelectorAll('.guide-trigger').forEach(button => button.addEventListener('click', () => {
    guideOpener = button;
    guide.showModal();
    document.body.classList.add('dialog-open');
  }));
  guide.querySelector('.dialog-close').addEventListener('click', () => guide.close());
  guide.addEventListener('click', event => { if (event.target === guide) {
    const box = guide.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) guide.close();
  }});
  guide.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    guideOpener?.focus({ preventScroll: true });
  });
})();
