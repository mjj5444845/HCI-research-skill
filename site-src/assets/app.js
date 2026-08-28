const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  nav?.toggleAttribute('data-open', !open);
});

document.addEventListener('click', event => {
  if (!nav?.hasAttribute('data-open')) return;
  if (nav.contains(event.target) || navToggle?.contains(event.target)) return;
  nav.removeAttribute('data-open');
  navToggle?.setAttribute('aria-expanded', 'false');
});

const progress = document.querySelector('.scroll-progress');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.06, rootMargin: '0px 0px -24px' });
  document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
}

const search = document.querySelector('[data-search]');
const searchable = [...document.querySelectorAll('[data-searchable]')];
const resultCount = document.querySelector('[data-result-count]');
search?.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  searchable.forEach(item => {
    const match = item.textContent.toLocaleLowerCase().includes(query);
    item.hidden = !match;
    if (match) visible += 1;
  });
  if (resultCount) resultCount.textContent = `${visible} 项`;
});

document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent);
      const original = button.textContent;
      button.textContent = '已复制';
      setTimeout(() => { button.textContent = original; }, 1400);
    } catch {
      button.textContent = '复制失败';
    }
  });
});

document.querySelectorAll('[data-program-map]').forEach(programMap => {
  const buttons = [...programMap.querySelectorAll('[data-program-node]')];
  const details = [...programMap.querySelectorAll('[data-program-detail]')];
  const select = id => {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.programNode === id)));
    details.forEach(detail => { detail.hidden = detail.dataset.programDetail !== id; });
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.programNode));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const delta = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = buttons[(index + delta + buttons.length) % buttons.length];
      next.focus();
      select(next.dataset.programNode);
    });
  });
});
