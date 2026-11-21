(() => {
  const buttons = [...document.querySelectorAll('[data-guide-view]')];
  const mapPanel = document.querySelector('[data-view-panel="map"]');
  if (!buttons.length || !mapPanel) return;

  const show = view => {
    const isMap = view === 'map';
    document.body.classList.toggle('map-view-active', isMap);
    mapPanel.hidden = !isMap;
    buttons.forEach(button => {
      const active = button.dataset.guideView === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (isMap || location.hash === '#map' || location.hash === '#list') history.replaceState(null, '', isMap ? '#map' : '#list');
  };

  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.guideView)));
  document.querySelector('[data-footer-map]')?.addEventListener('click', event => { event.preventDefault(); show('map'); });
  show(location.hash === '#map' ? 'map' : 'list');
})();
