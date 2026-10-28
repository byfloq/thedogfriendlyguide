/* Presentation for the app embed, connected to the existing map's real filters. */
window.TdfgAppMap = {
  install({ state, selectPlace, clearSelection, chooseDistrict, chooseCategory, resetFilters }) {
    if (!document.body.classList.contains('embed-mode')) return null;
    const t=window.TdfgMapText||((key)=>key);
    const shell = document.querySelector('.map-shell');
    const results = document.querySelector('.map-results');
    const rail = document.getElementById('place-rail');
    const filters = document.createElement('div');
    filters.className = 'app-map-filters';
    const makeSelect = (name, choices, choose) => {
      const label = document.createElement('label');
      label.textContent = t(name);
      const select = document.createElement('select');
      choices.forEach(({ value, text }) => select.add(new Option(t(text), value)));
      select.addEventListener('change', () => choose(select.value));
      label.append(select);
      filters.append(label);
      return select;
    };
    const district = makeSelect('Area', [...document.querySelectorAll('[data-district]')].map(button => ({ value:button.dataset.district, text:button.textContent.trim() })), chooseDistrict);
    const category = makeSelect('Places', [...document.querySelectorAll('.category-filters [data-category]')].map(button => ({ value:button.dataset.category, text:button.dataset.category === 'all' ? 'All places' : button.textContent.trim() })), chooseCategory);
    shell.append(filters);
    const locate = document.createElement('div');
    locate.className = 'app-map-locate';
    const locateButton = document.querySelector('.locate-button');
    locate.append(locateButton);
    shell.append(locate);
    const count = document.createElement('p');
    count.className = 'app-map-count';
    count.setAttribute('role', 'status');
    shell.append(count);
    const head = results.querySelector('.map-results-head');
    // The shared renderer already holds its visible-count reference.
    head.replaceChildren();
    const position = document.createElement('span');
    position.className = 'app-map-position';
    position.setAttribute('aria-live', 'polite');
    head.append(position);
    const action = (label, text, onClick) => {
      const button = document.createElement('button');
      button.className = 'app-map-nav'; button.type = 'button';
      button.setAttribute('aria-label', label); button.textContent = text;
      button.addEventListener('click', onClick); head.append(button);
      return button;
    };
    const move = step => {
      const current = state();
      const index = current.places.findIndex(p => p.key === current.selectedKey);
      const next = current.places[index + step];
      if (next) selectPlace(next.key);
    };
    const previous = action(t("Previous place"), '‹', () => move(-1));
    const next = action(t("Next place"), '›', () => move(1));
    const reset = action(t("Reset map filters"), t("Reset filters"), resetFilters);
    reset.classList.add('app-map-reset');
    const close = action(t("Close place card"), '×', clearSelection);
    rail.removeAttribute('tabindex');
    function update() {
      const current = state();
      district.value = current.district; category.value = current.category;
      locateButton.setAttribute('aria-pressed', String(current.nearby));
      locateButton.setAttribute('aria-label', current.nearby ? t("Clear nearby filter") : t("Show my current location"));
      locateButton.lastChild.textContent = ' '+t(current.nearby?'Nearby ×':'Near me');
      const total = current.places.length;
      const index = current.places.findIndex(p => p.key === current.selectedKey);
      count.textContent = t(current.nearby?'{count} places within 1.2 km · Tap a pin':'{count} places · Tap a pin',{count:total});
      count.hidden = index >= 0 || total === 0;
      results.hidden = index < 0 && total > 0;
      results.classList.toggle('has-selection', index >= 0 || total === 0);
      position.textContent = total === 0 ? t("No matches") : t('{index} of {total} places',{index:index+1,total});
      previous.hidden = next.hidden = close.hidden = total === 0;
      reset.hidden = total > 0;
      previous.disabled = index <= 0; next.disabled = index === total - 1;
      rail.querySelectorAll('.map-card').forEach(card => {
        const active = card.dataset.key === current.selectedKey;
        card.setAttribute('aria-hidden', String(!active));
        card.inert = !active; card.tabIndex = -1;
        if (new URLSearchParams(location.search).get('app') === '1' && !card.querySelector('.app-map-open')) {
          const instagram = card.querySelector('.map-card-actions a:not(.primary)');
          const open = document.createElement('button');
          open.type = 'button'; open.className = 'app-map-open'; open.textContent = t("View place");
          const place = current.places.find(p => p.key === card.dataset.key);
          open.setAttribute('aria-label', t('View place')+': '+place.name);
          open.addEventListener('click', () => {
            const message = { type:'tdfg:open-place', key:place.key };
            if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(message));
            else window.parent.postMessage(message, '*');
          });
          instagram.replaceWith(open);
        }
      });
      if (!total) {
        const empty = document.createElement('p'); empty.className = 'app-map-empty';
        empty.textContent = t("No places match these filters. Try another area or reset your filters.");
        rail.replaceChildren(empty);
      }
    }
    update();
    return {
      update,
      cameraPadding() {
        return { top:filters.offsetTop + filters.offsetHeight + 52, bottom:results.hidden ? 52 : results.offsetHeight + 44, left:32, right:32 };
      }
    };
  }
};
