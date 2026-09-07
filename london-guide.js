(() => {
  const cards = [...document.querySelectorAll('.place-card')];
  const regions = document.querySelector('.london-region-filters');
  const areas = document.querySelector('.london-area-filters');
  const count = document.querySelector('.cg-intro p');
  if (!cards.length || !regions || !areas) return;
  const selected = { region: 'all', area: 'all' };
  const activate = (group, active) => group.querySelectorAll('button').forEach(button => { button.classList.toggle('active', button === active); if (!button.disabled) button.setAttribute('aria-pressed', button === active ? 'true' : 'false'); });
  const updateAreas = () => areas.querySelectorAll('[data-area]').forEach(button => { button.hidden = !(button.dataset.regionGroup === 'all' || selected.region === 'all' || button.dataset.regionGroup === selected.region); });
  const apply = () => { let shown = 0; cards.forEach(card => { const visible = (selected.region === 'all' || card.dataset.region === selected.region) && (selected.area === 'all' || card.dataset.area === selected.area); card.classList.toggle('hidden', !visible); if (visible) shown += 1; }); const empty = document.querySelector('.empty-state'); if (empty) empty.style.display = shown ? 'none' : 'block'; if (count) count.textContent = `${shown} ${shown === 1 ? 'recommendation' : 'recommendations'}`; };
  regions.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => { selected.region = button.dataset.region; selected.area = 'all'; activate(regions, button); activate(areas, areas.querySelector('[data-area="all"]')); updateAreas(); apply(); }));
  areas.querySelectorAll('[data-area]').forEach(button => button.addEventListener('click', () => { selected.area = button.dataset.area; activate(areas, button); apply(); }));
  updateAreas(); apply();
})();
