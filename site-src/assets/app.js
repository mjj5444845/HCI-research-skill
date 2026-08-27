const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  nav?.toggleAttribute('data-open', !open);
});

const progress = document.querySelector('.scroll-progress');
const updateProgress = () => {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));

if (!reducedMotion) {
  document.querySelectorAll('.motion-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--tilt-x', `${(-y * 2.4).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 2.4).toFixed(2)}deg`);
      card.style.setProperty('--spot-x', `${((x + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${((y + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
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
    await navigator.clipboard.writeText(target.textContent);
    const original = button.textContent;
    button.textContent = '已复制';
    setTimeout(() => button.textContent = original, 1400);
  });
});

function initArchitectureCanvas(canvas) {
  const context = canvas.getContext('2d');
  const palette = { ink: '#14233a', orange: '#f06f44', teal: '#18a999', yellow: '#f4c553', paper: '#f7f1e8', line: 'rgba(20,35,58,.16)' };
  const nodes = [
    { x: .11, y: .48, label: 'Prompt', color: palette.yellow, size: 10 },
    { x: .31, y: .24, label: 'Skills', color: palette.orange, size: 15 },
    { x: .31, y: .72, label: 'Guardrail', color: palette.teal, size: 12 },
    { x: .55, y: .18, label: 'Agents', color: palette.paper, size: 17 },
    { x: .58, y: .52, label: 'Synthesis', color: palette.orange, size: 19 },
    { x: .80, y: .30, label: 'Evidence', color: palette.teal, size: 14 },
    { x: .84, y: .70, label: 'State', color: palette.yellow, size: 16 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,4],[3,4],[3,5],[4,5],[4,6],[5,6]];
  let width = 0, height = 0, frame = 0, pointerX = 0, pointerY = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = rect.width; height = rect.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
  });
  const draw = time => {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(pointerX * 6, pointerY * 4);
    edges.forEach(([from, to], index) => {
      const a = nodes[from], b = nodes[to];
      const ax = a.x * width, ay = a.y * height, bx = b.x * width, by = b.y * height;
      context.beginPath(); context.moveTo(ax, ay); context.lineTo(bx, by);
      context.strokeStyle = palette.line; context.lineWidth = 1.5; context.stroke();
      const t = reducedMotion ? .5 : ((time * .00012 + index * .11) % 1);
      const px = ax + (bx - ax) * t, py = ay + (by - ay) * t;
      context.beginPath(); context.arc(px, py, 3, 0, Math.PI * 2); context.fillStyle = index % 2 ? palette.orange : palette.teal; context.fill();
    });
    nodes.forEach((node, index) => {
      const pulse = reducedMotion ? 0 : Math.sin(time * .002 + index) * 1.5;
      const x = node.x * width, y = node.y * height;
      context.beginPath(); context.arc(x, y, node.size + pulse + 8, 0, Math.PI * 2); context.fillStyle = 'rgba(247,241,232,.08)'; context.fill();
      context.beginPath(); context.arc(x, y, node.size + pulse, 0, Math.PI * 2); context.fillStyle = node.color; context.fill();
      context.font = '600 12px system-ui'; context.fillStyle = palette.paper; context.textAlign = 'center'; context.fillText(node.label, x, y + node.size + 22);
    });
    context.restore();
    frame = requestAnimationFrame(draw);
  };
  new ResizeObserver(resize).observe(canvas);
  resize();
  frame = requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame); else frame = requestAnimationFrame(draw);
  });
}

document.querySelectorAll('[data-architecture-canvas]').forEach(initArchitectureCanvas);
