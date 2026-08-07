const categoryLinks = document.querySelectorAll('.category-card[data-filter]');
const cards = document.querySelectorAll('.place-card');
const showAll = document.getElementById('showAll');

categoryLinks.forEach(link => {
  link.addEventListener('click', () => {
    const filter = link.dataset.filter;
    if (filter === 'events') return;
    cards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      card.classList.toggle('hidden', !categories.includes(filter));
    });
    showAll.textContent = 'Show all';
  });
});

showAll.addEventListener('click', () => {
  cards.forEach(card => card.classList.remove('hidden'));
});
