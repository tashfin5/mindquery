/* assets/script.js
   Clean quiz frontend (shuffled questions)
   - Shuffles questions on initial load and on every retry/start
   - Keeps original server order in `originalQuestions` so each retry reshuffles fresh
   - Fisher–Yates shuffle
*/

(() => {
  const API = {
    GET_QUESTIONS: `api/get_questions`,
    GET_RESULTS: `api/get_results`,
    SUBMIT_RESULT: `api/submit_result`,
  };

  const QUESTION_TIME = 30; // seconds per question

  // DOM refs (IDs expected by your HTML)
  const starterUsername = document.getElementById('starter-username');
  const startBtn = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  const resultScreen = document.getElementById('result-screen');
  const qText = document.getElementById('question-text');
  const choicesList = document.getElementById('choices');
  const nextBtn = document.getElementById('next-btn');
  const qIndexEl = document.getElementById('qIndex');
  const qTotalEl = document.getElementById('qTotal');
  const scoreEl = document.getElementById('score');
  const resultMsg = document.getElementById('result-msg');
  const retryBtn = document.getElementById('retry-btn');
  const resultsList = document.getElementById('results-list');
  const progressFill = document.getElementById('progress-fill');
  const timerFill = document.getElementById('timer-fill');
  const timerSeconds = document.getElementById('timer-seconds');
  const autosaveMsg = document.getElementById('autosave-msg');
  const startError = document.getElementById('start-error');
  const themeToggle = document.getElementById('theme-toggle');

  // state
  let username = null;
  let originalQuestions = []; // keep server-provided order
  let questions = [];
  let current = 0;
  let answers = [];
  let score = 0;
  let loaded = false;

  // timers
  let questionTimer = null;
  let questionRemaining = QUESTION_TIME;
  let globalStart = null;

  // small helpers
  const log = (...a) => console.log('[quiz]', ...a);
  const err = (...a) => console.error('[quiz]', ...a);
  const escapeHtml = s => (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Fisher-Yates shuffle (in-place)
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // create a fresh shuffled copy from originalQuestions
  function shuffleQuestions() {
    // clone original
    let temp = originalQuestions.slice().map(q => ({ ...q }));

    // shuffle
    shuffleArray(temp);

    // if there are fewer than 20 questions, use all; otherwise pick first 20
    const LIMIT = Math.min(20, temp.length);
    questions = temp.slice(0, LIMIT);

    // reset answers array to match new length (prevent index mismatch)
    answers = new Array(questions.length).fill(null);

    if (qTotalEl) qTotalEl.textContent = questions.length;
    log('Shuffled and limited to', questions.length, 'questions (LIMIT=' + LIMIT + ')');
  }

  // fetch helper with status check
  async function fetchText(url, opts = {}) {
    const r = await fetch(url, opts);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.text();
  }

  // ---------- API Calls ----------
  async function loadQuestions() {
    log('Loading questions from', API.GET_QUESTIONS);
    try {
      const txt = await fetchText(API.GET_QUESTIONS, { cache: 'no-store' });
      log('get_questions raw (truncated):', txt.slice(0, 800));
      const data = JSON.parse(txt);
      if (!data || !data.success || !Array.isArray(data.questions)) {
        err('Invalid get_questions payload', data);
        loaded = false;
        return false;
      }

      // preserve original server order
      originalQuestions = data.questions.map(q => ({
        id: q.id,
        question: q.question,
        choices: Array.isArray(q.choices) ? q.choices :
                 (typeof q.choices === 'string' ? ( (() => {
                    try { return JSON.parse(q.choices || '[]'); } catch { return q.choices.split(/\r\n|\r|\n|,/).map(s=>s.trim()).filter(Boolean); }
                 })() ) : []),
        correct_index: (typeof q.correct_index !== 'undefined' && q.correct_index !== null) ? parseInt(q.correct_index,10) : null
      }));

      // shuffle a fresh working copy
      shuffleQuestions();

      loaded = questions.length > 0;
      if (qTotalEl) qTotalEl.textContent = questions.length;
      log('Loaded questions (original):', originalQuestions.length, 'shuffled:', questions.length);
      return true;

    } catch (e) {
      err('loadQuestions error', e);
      loaded = false;
      return false;
    }
  }

  // Updated loadPastResults to include Time Taken and nicer layout
  async function loadPastResults(page = 1, per_page = 6) {
    if (!resultsList) return;
    const paginationEl = document.getElementById('results-pagination');
    resultsList.innerHTML = '<p>Loading...</p>';
    if (paginationEl) paginationEl.innerHTML = '';

    function fmtTime(seconds) {
      if (seconds === null || seconds === undefined || seconds === '') return '-';
      seconds = Number(seconds);
      if (isNaN(seconds) || seconds < 0) return '-';
      if (seconds < 60) return `${seconds}s`;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${String(s).padStart(2,'0')}s`;
    }

    try {
      const url = `${API.GET_RESULTS}?page=${encodeURIComponent(page)}&per_page=${encodeURIComponent(per_page)}`;
      const res = await fetch(url, { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const text = await res.text();
      const data = JSON.parse(text);

      if (!data || !data.success) {
        resultsList.innerHTML = '<p>Failed to load results</p>';
        return;
      }

      const rows = data.results || [];
      const total = data.total || 0;
      const pages = data.pages || 1;
      const current = data.page || 1;

      if (rows.length === 0) {
        resultsList.innerHTML = '<p>No saved results yet.</p>';
        if (paginationEl) paginationEl.innerHTML = '';
        return;
      }

      // Build spacious table with Time Taken column
      let html = '<table aria-label="Past results">';
      html += '<thead><tr><th>Name</th><th style="width:110px">Score</th><th style="width:120px">Time Taken</th><th style="width:220px">Date</th></tr></thead>';
      html += '<tbody>';
      for (const r of rows) {
        const name = escapeHtml(r.username || 'Anonymous');
        const score = escapeHtml(String(r.score || '0')) + '/' + escapeHtml(String(r.total || '0'));
        const timeTaken = fmtTime(r.time_taken);
        const dt = escapeHtml(r.created_at || '');
        html += `<tr>
        <td class="name">${name}</td>
        <td class="score">${score}</td>
        <td class="time-taken">${escapeHtml(timeTaken)}</td>
        <td class="date">${dt}</td>
      </tr>`;
      }
      html += '</tbody></table>';
      resultsList.innerHTML = html;

      // pagination controls (compact)
      if (paginationEl) {
        const createBtn = (label, p, disabled=false) => {
          const bg = disabled ? 'rgba(0,0,0,0.06)' : 'var(--purple-500)';
          const color = disabled ? '#9ca3af' : '#fff';
          const disabledAttr = disabled ? 'disabled' : '';
          return `<button data-page="${p}" class="btn-page" ${disabledAttr} style="margin:4px;padding:6px 10px;border-radius:8px;border:0;cursor:pointer;background:${bg};color:${color};font-weight:700">${label}</button>`;
        };
        let pagerHtml = '';
        pagerHtml += current > 1 ? createBtn('Prev', current - 1) : createBtn('Prev', current - 1, true);
        const start = Math.max(1, current - 2);
        const end = Math.min(pages, current + 2);
        if (start > 1) pagerHtml += `<button data-page="1" class="btn-page" style="margin:4px;padding:6px 10px;border-radius:8px;border:0;cursor:pointer;background:transparent;color:var(--muted)">${1}</button>${ start > 2 ? '...' : '' }`;
        for (let p = start; p <= end; p++) {
          if (p === current) pagerHtml += `<button disabled style="margin:4px;padding:6px 10px;border-radius:8px;border:0;background:transparent;color:var(--muted);font-weight:700">${p}</button>`;
          else pagerHtml += createBtn(p, p);
        }
        if (end < pages) pagerHtml += `${ end < pages - 1 ? '...' : '' }<button data-page="${pages}" class="btn-page" style="margin:4px;padding:6px 10px;border-radius:8px;border:0;cursor:pointer;background:transparent;color:var(--muted)">${pages}</button>`;
        pagerHtml += (current < pages) ? createBtn('Next', current + 1) : createBtn('Next', current + 1, true);

        paginationEl.innerHTML = pagerHtml;
        paginationEl.querySelectorAll('.btn-page').forEach(b => {
          b.addEventListener('click', () => {
            const p = parseInt(b.getAttribute('data-page'), 10) || 1;
            loadPastResults(p, per_page);
          });
        });
      }

    } catch (e) {
      console.error('[quiz] Network error loading past results', e);
      resultsList.innerHTML = '<p>Error loading results</p>';
      if (paginationEl) paginationEl.innerHTML = '';
    }
  }


  async function submitResult(payload) {
    try {
      const res = await fetch(API.SUBMIT_RESULT, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        throw new Error('HTTP ' + res.status + ' ' + txt);
      }
      const txt = await res.text();
      return JSON.parse(txt);
    } catch (e) {
      err('submitResult error', e);
      return { success: false, error: e.message || 'Network error' };
    }
  }

  // ---------- UI Rendering ----------
  function renderQuestion() {
    if (!questions[current]) return;
    const q = questions[current];
    if (qIndexEl) qIndexEl.textContent = current + 1;
    if (qText) qText.textContent = q.question;
    if (!choicesList) return;
    choicesList.innerHTML = '';
    if (nextBtn) nextBtn.disabled = true;

    q.choices.forEach((choice, idx) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.innerHTML = escapeHtml(choice);
      btn.addEventListener('click', () => {
        // selection UI
        [...choicesList.querySelectorAll('.choice-btn')].forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        answers[current] = idx;
        if (nextBtn) nextBtn.disabled = false;
      });
      li.appendChild(btn);
      choicesList.appendChild(li);
    });

    // progress fill (before answering current)
    if (progressFill) {
      const pct = Math.round((current / Math.max(1, questions.length)) * 100);
      progressFill.style.width = pct + '%';
    }

    startQuestionTimer();
  }

  // ---------- Timer ----------
  function startQuestionTimer() {
    stopQuestionTimer();
    questionRemaining = QUESTION_TIME;
    updateTimerUI();
    questionTimer = setInterval(() => {
      questionRemaining--;
      updateTimerUI();
      if (questionRemaining <= 0) {
        stopQuestionTimer();
        setTimeout(()=> {
          current++;
          if (current < questions.length) renderQuestion();
          else finishQuiz();
        }, 200);
      }
    }, 1000);
  }
  function stopQuestionTimer() {
    if (questionTimer) { clearInterval(questionTimer); questionTimer = null; }
  }
  function updateTimerUI() {
    if (timerFill) {
      const pct = Math.max(0, Math.round((questionRemaining / QUESTION_TIME) * 100));
      timerFill.style.width = pct + '%';
    }
    if (timerSeconds) timerSeconds.textContent = (questionRemaining >= 0 ? questionRemaining : 0) + 's';
    if (questionRemaining <= 4) timerFill.style.background = 'linear-gradient(90deg,#f97316,#ef4444)';
    else timerFill.style.background = '';
  }

  // ---------- Finish & Save ----------
  async function finishQuiz() {
    stopQuestionTimer();
    score = 0;
    questions.forEach((q,i) => {
      if (typeof q.correct_index === 'number' && answers[i] === q.correct_index) score++;
    });

    if (scoreEl) scoreEl.textContent = `${score} / ${questions.length}`;

    let totalTime = 0;
    if (globalStart) totalTime = Math.round((Date.now() - globalStart) / 1000);
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;
    const timeText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    if (resultMsg) resultMsg.textContent = `You scored ${Math.round((score / Math.max(1, questions.length))*100)}% (${score}/${questions.length}). Total time: ${timeText}`;

    startScreen && startScreen.classList.add('hidden');
    questionScreen && questionScreen.classList.add('hidden');
    resultScreen && resultScreen.classList.remove('hidden');

    if (autosaveMsg) autosaveMsg.style.display = 'block';
    const payload = { username: username || null, total: questions.length, score, time_taken: totalTime };
    const res = await submitResult(payload);
    if (res && res.success) {
      if (autosaveMsg) autosaveMsg.textContent = 'Result saved!';
      setTimeout(()=> { if (autosaveMsg) autosaveMsg.style.display = 'none'; }, 1400);
      await loadPastResults();
    } else {
      if (autosaveMsg) autosaveMsg.textContent = 'Auto-save failed';
      alert('Failed to save result: ' + (res && res.error ? res.error : 'unknown'));
    }
  }

  // ---------- Event wiring ----------
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      const val = starterUsername ? starterUsername.value.trim() : '';
      if (!val) {
        if (startError) startError.style.display = 'block';
        return;
      }
      if (startError) startError.style.display = 'none';
      username = val;
      try { localStorage.setItem('quiz_name', username); } catch(e){}
      globalStart = Date.now();
      current = 0; answers = []; score = 0;

      // reshuffle for this attempt
      if (originalQuestions.length > 0) shuffleQuestions();

      renderQuestion();
      if (startScreen) startScreen.classList.add('hidden');
      if (questionScreen) questionScreen.classList.remove('hidden');
      if (resultScreen) resultScreen.classList.add('hidden');
    });
  }

  if (starterUsername) {
    starterUsername.addEventListener('input', (e) => {
      const v = e.target.value.trim();
      if (startBtn) startBtn.disabled = !v;
      if (startError) startError.style.display = 'none';
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopQuestionTimer();
      current++;
      if (current < questions.length) renderQuestion();
      else finishQuiz();
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      stopQuestionTimer();
      current = 0; answers = []; score = 0; globalStart = null;
      // reshuffle fresh from originalQuestions so order differs on each retry
      if (originalQuestions.length > 0) shuffleQuestions();

      // prefill name from localStorage (so they don't retype)
      try {
        const saved = localStorage.getItem('quiz_name');
        if (starterUsername && saved) starterUsername.value = saved;
        if (startBtn) startBtn.disabled = !saved;
      } catch(e){}
      if (startScreen) startScreen.classList.remove('hidden');
      if (questionScreen) questionScreen.classList.add('hidden');
      if (resultScreen) resultScreen.classList.add('hidden');
    });
  }

  // ---------- Dark mode toggle init (preserve previous behavior) ----------
  function initThemeToggle() {
    try {
      const stored = localStorage.getItem('quiz_dark');
      const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = stored === '1' || (stored === null && prefers);
      document.documentElement.classList.toggle('dark', !!dark);
      if (themeToggle) {
        themeToggle.innerHTML = dark ? svg_sun() : svg_moon();
        themeToggle.addEventListener('click', () => {
          const isDark = document.documentElement.classList.toggle('dark');
          localStorage.setItem('quiz_dark', isDark ? '1' : '0');
          themeToggle.innerHTML = isDark ? svg_sun() : svg_moon();
        });
      }
    } catch(e) { console.warn('theme init failed', e); }
  }
  function svg_moon(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>`; }
  function svg_sun(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v2M12 18v2M4 12H2M22 12h-2M5 5l-1.4-1.4M20.4 20.4L19 19M19 5l1.4-1.4M5 19L3.6 20.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

  // ---------- Init ----------
  (async function init() {
    initThemeToggle();
    // prefill name from localStorage
    try {
      const saved = localStorage.getItem('quiz_name');
      if (starterUsername && saved) {
        starterUsername.value = saved;
        if (startBtn) startBtn.disabled = !saved.trim();
      }
    } catch(e){}

    const ok = await loadQuestions();
    await loadPastResults();
    if (!ok) {
      if (startBtn) startBtn.addEventListener('click', ()=> alert('No questions available'));
      return;
    }
    // show start screen by default
    if (startScreen) startScreen.classList.remove('hidden');
    if (questionScreen) questionScreen.classList.add('hidden');
    if (resultScreen) resultScreen.classList.add('hidden');
  })();

})();
