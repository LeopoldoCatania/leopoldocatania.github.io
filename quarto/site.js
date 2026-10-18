
(() => {
  const input = document.getElementById('paper-search');
  if (!input) return;
  const papers = Array.from(document.querySelectorAll('[data-paper]'));
  const sections = Array.from(document.querySelectorAll('.research-section'));
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const indexed = papers.map(paper => ({ paper, text: normalize(paper.textContent) }));
  sections.forEach(section => {
    section.querySelector('.count').textContent = section.querySelectorAll('[data-paper]').length;
  });
  document.querySelector('.search-wrap').hidden = false;
  input.addEventListener('input', () => {
    const query = normalize(input.value.trim());
    let matches = 0;
    indexed.forEach(({paper, text}) => {
      paper.hidden = !text.includes(query);
      if (!paper.hidden) matches++;
    });
    sections.forEach(section => {
      const visible = Array.from(section.querySelectorAll('[data-paper]')).filter(p => !p.hidden).length;
      section.hidden = visible === 0;
      section.querySelector('.count').textContent = visible;
    });
    document.getElementById('no-results').hidden = matches > 0;
    document.getElementById('search-count').textContent = `${matches} papers found`;
  });
})();
