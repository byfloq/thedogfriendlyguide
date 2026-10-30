/* Presentation for the app embed, connected to the existing map's real filters. */
window.TdfgAppMap = {
  install({ state, selectPlace, clearSelection, chooseDistrict, chooseCategory, resetFilters, searchPlaces }) {
    if (!document.body.classList.contains('embed-mode')) return null;
    const t=window.TdfgMapText||((key)=>key);
    const shell = document.querySelector('.map-shell');
    const results = document.querySelector('.map-results');
    const rail = document.getElementById('place-rail');
    const filters = document.createElement('div');
    filters.className = 'app-map-filters';
    const search=document.createElement('input');search.type='search';search.className='app-map-search';search.placeholder=t('Search places or neighbourhoods');search.setAttribute('aria-label',t('Search places or neighbourhoods'));
    let searchTimer;search.addEventListener('input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchPlaces?.(search.value),160);});filters.append(search);
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
    const reset = action(t("Reset map filters"), t("Reset filters"), ()=>{search.value='';resetFilters();});
    reset.classList.add('app-map-reset');
    const close = action(t("Close place card"), '×', clearSelection);
    rail.removeAttribute('tabindex');results.append(head);
    let touch;rail.addEventListener('touchstart',event=>{const p=event.touches[0];touch={x:p.clientX,y:p.clientY};},{passive:true});rail.addEventListener('touchend',event=>{if(!touch)return;const p=event.changedTouches[0],dx=p.clientX-touch.x,dy=p.clientY-touch.y;touch=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)move(dx<0?1:-1);},{passive:true});
    const observer=new ResizeObserver(()=>shell.style.setProperty('--place-sheet-height',results.hidden?'0px':results.getBoundingClientRect().height+'px'));observer.observe(results);

    function update() {
      const current = state();
      district.value = current.district; category.value = current.category;
      locateButton.removeAttribute('aria-pressed');
      locateButton.setAttribute('aria-label', current.nearby ? t("Clear nearby filter") : t("Show my current location"));
      locateButton.setAttribute('aria-label',t('Show my current location'));locateButton.lastChild.textContent='';locateButton.title=t('Show my current location');
      const total = current.places.length;
      const index = current.places.findIndex(p => p.key === current.selectedKey);
      count.textContent = t(current.nearby?'{count} places within 1.2 km · Tap a pin':'{count} places · Tap a photo',{count:total});
      count.hidden = index >= 0 || total === 0;
      results.hidden = index < 0 && total > 0;
      results.classList.toggle('has-selection', index >= 0 || total === 0);shell.classList.toggle('has-place-selection',index>=0);shell.style.setProperty('--place-sheet-height',results.hidden?'0px':results.getBoundingClientRect().height+'px');
      position.textContent = total === 0 ? t("No matches") : t('{index} of {total} places',{index:index+1,total});
      previous.hidden = next.hidden = close.hidden = total === 0;
      reset.hidden = total > 0;
      previous.disabled = index <= 0; next.disabled = index === total - 1;
      rail.querySelectorAll('.map-card').forEach(card => {
        const placeData=current.places.find(place=>place.key===card.dataset.key);
        if(placeData){
          const area=({'le-marais':'Le Marais','saint-lazare':'Saint-Lazare','etienne-marcel':'Étienne Marcel','latin-quarter':'Quartier Latin','saint-germain':'Saint-Germain','buttes-chaumont':'Buttes-Chaumont'})[placeData.area]||placeData.area.split('-').map(word=>word[0]?.toUpperCase()+word.slice(1)).join(' ');
          const category=({cafes:'Café',cafe:'Café',restaurant:'Restaurant',shop:'Dog shop',hotel:'Hotel'})[placeData.category]||'';
          card.querySelector('.map-card-kicker').textContent=t(category)+' · '+area;
          let policy=card.querySelector('.app-map-policy');if(!policy){policy=document.createElement('p');policy.className='app-map-policy';card.querySelector('.map-card-copy').insertBefore(policy,card.querySelector('.map-card-actions'));}
          policy.textContent=t(/sociable dogs are welcome/i.test(placeData.description)?'Sociable dogs welcome':/dogs are welcome inside/i.test(placeData.description)?'Dogs welcome inside':'Dog policy: confirm with venue');
        }

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
    results.hidden=true;count.hidden=true;
    return {
      update,
      cameraPadding() {
        return { top:filters.offsetTop + filters.offsetHeight + 52, bottom:results.hidden ? 52 : results.offsetHeight + 44, left:32, right:32 };
      }
    };
  }
};
