(function () {
  'use strict';

  const EXERCISES = window.EXERCISES;
  const STORE_KEY = 'n5-flowchart-sorter';
  const KEYWORDS = new Set(['DECLARE', 'INITIALLY', 'SET', 'TO', 'RECEIVE', 'FROM', 'KEYBOARD', 'SEND',
    'DISPLAY', 'IF', 'THEN', 'ELSE', 'END', 'WHILE', 'DO', 'FOR', 'EACH', 'REPEAT', 'UNTIL',
    'AND', 'OR', 'NOT', 'INTEGER', 'REAL', 'STRING', 'BOOLEAN', 'CHARACTER']);
  const FUNCTIONS = new Set(['RANDOM', 'ROUND', 'LENGTH']);

  const $ = id => document.getElementById(id);
  const els = {
    taskList: $('task-list'), taskMenu: $('task-menu'), keyList: $('key-list'),
    topic: $('topic'), level: $('level'), title: $('title'), brief: $('brief'),
    chart: $('chart'), list: $('code-list'), feedback: $('feedback'),
    indent: $('indent-toggle'), check: $('check-btn'), hint: $('hint-btn'),
    shuffle: $('shuffle-btn'), reveal: $('reveal-btn'),
    progressCount: $('progress-count'), progressFill: $('progress-fill')
  };

  /* ---------- Saved progress ---------- */

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; }
  }
  function saveStore() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* storage unavailable */ }
  }
  const store = loadStore();
  store.done = store.done || {};

  /* ---------- State ---------- */

  let current = 0;
  let solution = [];     // [{ text, indent }]
  let attempts = 0;
  let hints = 0;
  let finished = false;

  function parseLine(line) {
    const m = line.match(/^( *)(.*)$/);
    return { text: m[2], indent: Math.floor(m[1].length / 2) };
  }

  function shuffled(items) {
    const a = items.slice();
    for (let tries = 0; tries < 20; tries++) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      if (a.some((item, i) => item.text !== items[i].text)) break;
    }
    return a;
  }

  /* ---------- Rendering ---------- */

  function highlight(text) {
    const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text.split(/("[^"]*")/).map(part => {
      if (part.startsWith('"')) return `<span class="tok-str">${esc(part)}</span>`;
      return esc(part).replace(/\b([A-Z]{2,})\b/g, word => {
        if (KEYWORDS.has(word)) return `<span class="tok-kw">${word}</span>`;
        if (FUNCTIONS.has(word)) return `<span class="tok-fn">${word}</span>`;
        return word;
      }).replace(/\b(\d+(\.\d+)?)\b/g, '<span class="tok-num">$1</span>');
    }).join('');
  }

  function renderTaskList() {
    els.taskList.innerHTML = EXERCISES.map((ex, i) => `
      <li>
        <button type="button" class="task${i === current ? ' is-current' : ''}${store.done[ex.id] ? ' is-done' : ''}" data-index="${i}" ${i === current ? 'aria-current="true"' : ''}>
          <span class="task-num">${i + 1}</span>
          <span class="task-text">
            <span class="task-title">${ex.title}</span>
            <span class="task-topic">${ex.topic}</span>
          </span>
          <span class="task-tick" aria-label="${store.done[ex.id] ? 'Complete' : ''}">${store.done[ex.id] ? '✓' : ''}</span>
        </button>
      </li>`).join('');
    const done = EXERCISES.filter(ex => store.done[ex.id]).length;
    els.progressCount.textContent = `${done} / ${EXERCISES.length}`;
    els.progressFill.style.width = (100 * done / EXERCISES.length) + '%';
  }

  function renderKey() {
    const symbols = [
      ['terminator', 'Start / End', 'Terminator: where the algorithm begins and ends.'],
      ['io', 'Get / Display', 'Input or output: RECEIVE from the keyboard or SEND to the display.'],
      ['process', 'total = 0', 'Process: a calculation or assignment (SET).'],
      ['decision', 'mark ≥ 50?', 'Decision: a condition with Yes and No exits (IF, WHILE, UNTIL).'],
      ['loop', 'counter from 1 to 5', 'Fixed loop: repeats a set number of times (FOR, FOR EACH).']
    ];
    els.keyList.innerHTML = symbols.map(([kind, text, desc]) =>
      `<div class="key-item"><dt>${Flowchart.renderSymbol(kind, text)}</dt><dd>${desc}</dd></div>`).join('');
  }

  function renderLine(item) {
    const li = document.createElement('li');
    li.className = 'code-line';
    li.tabIndex = 0;
    li.dataset.text = item.text;
    li.dataset.indent = item.indent;
    li.innerHTML = `
      <span class="grip" aria-hidden="true" title="Drag to move"><svg viewBox="0 0 10 16" width="10" height="16"><circle cx="2.5" cy="3" r="1.5"/><circle cx="7.5" cy="3" r="1.5"/><circle cx="2.5" cy="8" r="1.5"/><circle cx="7.5" cy="8" r="1.5"/><circle cx="2.5" cy="13" r="1.5"/><circle cx="7.5" cy="13" r="1.5"/></svg></span>
      <code class="code-text" style="--indent:${item.indent}">${highlight(item.text)}</code>
      <span class="mover">
        <button type="button" class="move" data-dir="-1" aria-label="Move line up">▲</button>
        <button type="button" class="move" data-dir="1" aria-label="Move line down">▼</button>
      </span>`;
    return li;
  }

  function loadExercise(index) {
    current = index;
    const ex = EXERCISES[index];
    solution = ex.code.map(parseLine);
    attempts = 0;
    hints = 0;
    finished = false;

    els.topic.textContent = ex.topic;
    els.level.innerHTML = `<span class="sr-only">Difficulty ${ex.level} of 3</span>` +
      [1, 2, 3].map(n => `<i class="${n <= ex.level ? 'on' : ''}" aria-hidden="true"></i>`).join('');
    els.title.textContent = `${index + 1}. ${ex.title}`;
    els.brief.textContent = ex.brief;
    els.chart.innerHTML = Flowchart.render(ex.flow, `Flowchart for ${ex.title}`);

    setOrder(shuffled(solution));
    setFeedback('');
    resetRevealButton();
    renderTaskList();
    try { localStorage.setItem(STORE_KEY + '-current', ex.id); } catch (e) { /* ignore */ }
  }

  function setOrder(items) {
    els.list.innerHTML = '';
    items.forEach(item => els.list.appendChild(renderLine(item)));
    els.list.classList.toggle('is-solved', false);
    applyIndent();
  }

  function applyIndent() {
    els.list.classList.toggle('show-indent', els.indent.checked || finished);
  }

  function lines() { return Array.from(els.list.children); }

  function clearMarks() {
    lines().forEach(li => li.classList.remove('is-right', 'is-wrong'));
    if (!finished) setFeedback('');
  }

  function setFeedback(html, tone) {
    els.feedback.innerHTML = html;
    els.feedback.className = 'feedback' + (tone ? ' is-' + tone : '');
  }

  /* ---------- Checking, hints and answers ---------- */

  function check() {
    if (finished) return;
    attempts++;
    let right = 0;
    lines().forEach((li, i) => {
      const ok = li.dataset.text === solution[i].text;
      li.classList.toggle('is-right', ok);
      li.classList.toggle('is-wrong', !ok);
      if (ok) right++;
    });
    if (right === solution.length) {
      complete();
    } else {
      setFeedback(`<strong>${right} of ${solution.length}</strong> lines are in the right place. Lines marked with a cross need to move. Trace the flowchart from Start and try again.`, 'partial');
    }
  }

  function complete() {
    finished = true;
    const ex = EXERCISES[current];
    store.done[ex.id] = true;
    saveStore();
    renderTaskList();
    els.list.classList.add('is-solved');
    applyIndent();
    const extra = hints ? ` with ${hints} hint${hints > 1 ? 's' : ''}` : '';
    const next = current < EXERCISES.length - 1
      ? ` <button type="button" class="btn btn-primary btn-small" id="next-btn">Next task →</button>` : ' That was the last task.';
    setFeedback(`<strong>Correct!</strong> Solved in ${attempts} ${attempts === 1 ? 'check' : 'checks'}${extra}. The indentation is now shown so you can see how each block is nested.${next}`, 'success');
    const nextBtn = $('next-btn');
    if (nextBtn) nextBtn.addEventListener('click', () => { loadExercise(current + 1); scrollToTop(); });
  }

  function hint() {
    if (finished) return;
    const items = lines();
    const i = items.findIndex((li, k) => li.dataset.text !== solution[k].text);
    if (i === -1) { check(); return; }
    const target = items.slice(i + 1).find(li => li.dataset.text === solution[i].text);
    els.list.insertBefore(target, items[i]);
    clearMarks();
    hints++;
    target.classList.add('is-hinted');
    setTimeout(() => target.classList.remove('is-hinted'), 1600);
    setFeedback(`Hint: line ${i + 1} should be <code>${highlight(solution[i].text)}</code>. It has been moved into place.`, 'hint');
  }

  let revealArmed = false;
  let revealTimer;
  function resetRevealButton() {
    revealArmed = false;
    clearTimeout(revealTimer);
    els.reveal.textContent = 'Show answer';
  }
  function reveal() {
    if (finished) return;
    if (!revealArmed) {
      revealArmed = true;
      els.reveal.textContent = 'Click again to show';
      revealTimer = setTimeout(resetRevealButton, 3000);
      return;
    }
    resetRevealButton();
    finished = true;
    setOrder(solution);
    lines().forEach(li => li.classList.add('is-right'));
    applyIndent();
    setFeedback('This is the correct order. Study how each flowchart symbol matches a line, then press <strong>Shuffle</strong> to try it yourself.', 'hint');
  }

  function reshuffle() {
    finished = false;
    attempts = 0;
    hints = 0;
    resetRevealButton();
    setOrder(shuffled(solution));
    setFeedback('');
  }

  /* ---------- Reordering ---------- */

  function moveLine(li, dir) {
    if (finished) return;
    const sibling = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
    if (!sibling) return;
    els.list.insertBefore(li, dir < 0 ? sibling : sibling.nextElementSibling);
    clearMarks();
  }

  let drag = null;

  function onPointerDown(e) {
    if (finished || e.button !== 0) return;
    const li = e.target.closest('.code-line');
    if (!li || e.target.closest('.move')) return;
    // Touch users drag from the grip so they can still scroll the page.
    if (e.pointerType !== 'mouse' && !e.target.closest('.grip')) return;
    e.preventDefault();
    const rect = li.getBoundingClientRect();
    drag = { li, grab: e.clientY - rect.top, id: e.pointerId };
    li.setPointerCapture(e.pointerId);
    li.classList.add('is-dragging');
    document.body.classList.add('is-dragging');
    clearMarks();
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { li } = drag;
    const y = e.clientY;
    let prev = li.previousElementSibling;
    while (prev && y < midpoint(prev)) {
      els.list.insertBefore(li, prev);
      prev = li.previousElementSibling;
    }
    let next = li.nextElementSibling;
    while (next && y > midpoint(next)) {
      els.list.insertBefore(li, next.nextElementSibling);
      next = li.nextElementSibling;
    }
    li.style.transform = '';
    const natural = li.getBoundingClientRect().top;
    li.style.transform = `translateY(${y - drag.grab - natural}px)`;
    if (y < 50) window.scrollBy(0, -12);
    else if (y > window.innerHeight - 50) window.scrollBy(0, 12);
  }

  function midpoint(el) {
    const r = el.getBoundingClientRect();
    return r.top + r.height / 2;
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.li.style.transform = '';
    drag.li.classList.remove('is-dragging');
    document.body.classList.remove('is-dragging');
    drag = null;
  }

  function onKeyDown(e) {
    const li = e.target.closest('.code-line');
    if (!li || !e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    moveLine(li, e.key === 'ArrowUp' ? -1 : 1);
    li.focus();
  }

  function scrollToTop() {
    $('workspace').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------- Wiring ---------- */

  els.list.addEventListener('pointerdown', onPointerDown);
  els.list.addEventListener('pointermove', onPointerMove);
  els.list.addEventListener('pointerup', onPointerUp);
  els.list.addEventListener('pointercancel', onPointerUp);
  els.list.addEventListener('keydown', onKeyDown);
  els.list.addEventListener('click', e => {
    const btn = e.target.closest('.move');
    if (btn) moveLine(btn.closest('.code-line'), Number(btn.dataset.dir));
  });

  els.taskList.addEventListener('click', e => {
    const btn = e.target.closest('.task');
    if (!btn) return;
    loadExercise(Number(btn.dataset.index));
    if (matchMedia('(max-width: 900px)').matches) {
      els.taskMenu.open = false;
      scrollToTop();
    }
  });

  els.indent.addEventListener('change', applyIndent);
  els.check.addEventListener('click', check);
  els.hint.addEventListener('click', hint);
  els.shuffle.addEventListener('click', reshuffle);
  els.reveal.addEventListener('click', reveal);

  if (matchMedia('(max-width: 900px)').matches) els.taskMenu.open = false;

  renderKey();
  let startAt = 0;
  try {
    const saved = localStorage.getItem(STORE_KEY + '-current');
    const found = EXERCISES.findIndex(ex => ex.id === saved);
    if (found >= 0) startAt = found;
  } catch (e) { /* ignore */ }
  loadExercise(startAt);
})();
