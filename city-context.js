// Preserve an explicitly selected edition through editorial and information pages.
(() => {
  const city = new URLSearchParams(location.search).get('city');
  if (!['paris', 'london', 'berlin', 'madrid', 'barcelona'].includes(city)) return;
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.href);
    if (url.origin !== location.origin) return;
    if (/\/(?:index|journal[^/]*|about|contact|submit)\.html$/.test(url.pathname) || url.pathname === '/') {
      url.searchParams.set('city', city);
      link.href = url.pathname + url.search + url.hash;
    }
  });
})();
