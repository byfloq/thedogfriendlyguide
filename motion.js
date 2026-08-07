(() => {
  const mobile = window.matchMedia('(max-width: 760px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!mobile.matches || reduced.matches) return;

  const selectors = [
    '.section-title',
    '.city-card',
    '.journal-lead',
    '.journal-list > a',
    '.coco-text',
    '.polaroid',
    '.newsletter > *',
    '.values > div',
    '.place-list article',
    '.map-intro',
    '.map-art',
    '.map-places article'
  ];

  const items = document.querySelectorAll(selectors.join(','));
  if (!items.length) return;

  items.forEach((item, index) => {
    item.classList.add('motion-reveal');
    if (item.matches('.city-card,.journal-list > a,.place-list article,.map-places article')) item.dataset.motion = 'soft';
    if (item.matches('.map-art')) item.dataset.motion = 'scale';
    item.style.transitionDelay = `${Math.min((index % 4) * 45, 135)}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  items.forEach(item => observer.observe(item));
})();
