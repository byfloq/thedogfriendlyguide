const launchStyles=document.createElement('link');launchStyles.rel='stylesheet';launchStyles.href='launch-guides.css?v=1';document.head.append(launchStyles);
const filters=[...document.querySelectorAll('.country-filters button')];
const guides=[...document.querySelectorAll('.cities-directory a')];
const status=document.querySelector('.filter-status');
function showCountry(country){let visible=0;guides.forEach(guide=>{const show=country==='all'||guide.dataset.country===country;guide.hidden=!show;if(show)visible+=1;});filters.forEach(filter=>{const active=filter.dataset.country===country;filter.classList.toggle('active',active);filter.setAttribute('aria-pressed',String(active));});status.textContent=`${visible} ${visible===1?'destination':'destinations'}`;}
filters.forEach(filter=>filter.addEventListener('click',()=>showCountry(filter.dataset.country)));
