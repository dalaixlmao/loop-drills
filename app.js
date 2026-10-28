'use strict';
(function () {
  // ------------------------------------------------------------------ constants
  const NS = 'ld';
  const DEFAULT_SYNC = { owner: 'dalaixlmao', repo: 'loop-drills-data', branch: 'main', token: '' };
  const STATUS_LABEL = { todo: 'To do', attempted: 'Attempted', solved: 'Solved' };
  const FONTS = {
    arial: 'Arial, "Liberation Sans", Helvetica, sans-serif',
    courier: '"Courier New", Courier, "Liberation Mono", monospace',
    roboto: '"Roboto Mono", ui-monospace, Menlo, monospace',
  };
  const FONT_LABEL = { arial: 'Arial', courier: 'Courier New', roboto: 'Roboto Mono' };
  const SIZES = [13, 14, 15, 16, 18];
  const TIMER_SECONDS = 45 * 60;
  const OWN_PATTERN = { id: 'own', tier: 0, name: 'Your own questions', signal: 'Questions you added that are not filed under a pattern yet.' };

  const svg = (body, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${body}</svg>`;
  const I = {
    logo: svg('<path d="M7.5 8.5a3.5 3.5 0 1 0 0 7c1.9 0 3-1.6 4.5-3.5s2.6-3.5 4.5-3.5a3.5 3.5 0 1 1 0 7c-1.9 0-3-1.6-4.5-3.5S9.4 8.5 7.5 8.5z"/>', 'stroke-width="2.4"'),
    plus: svg('<path d="M12 5v14M5 12h14"/>'),
    shuffle: svg('<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>'),
    gear: svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    back: svg('<path d="M19 12H5M12 19l-7-7 7-7"/>'),
    ext: svg('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    chev: svg('<path d="m6 9 6 6 6-6"/>', 'class="chev"'),
    left: svg('<path d="m15 18-6-6 6-6"/>'),
    right: svg('<path d="m9 18 6-6-6-6"/>'),
    play: svg('<path d="M7 5v14l11-7z" fill="currentColor"/>'),
    pause: svg('<path d="M8 5v14M16 5v14" stroke-width="3"/>'),
    reset: svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    check: svg('<path d="M20 6 9 17l-5-5" stroke-width="3.2"/>'),
    ruler: svg('<path d="M4 7h16M4 12h10M4 17h13"/>'),
    chat: svg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.8A8 8 0 1 1 21 12z"/>'),
    bulb: svg('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3z"/>'),
    code: svg('<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>'),
    eye: svg('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    copy: svg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
    cloud: svg('<path d="M7 19h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.2 9.2 5 5 0 0 0 7 19z"/><path d="m9.2 14 2 2 3.6-3.6"/>'),
    pencil: svg('<path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>'),
    trash: svg('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
    download: svg('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  };
  const DOC_ICON = '<svg class="doc-ico" viewBox="0 0 22 28" aria-hidden="true"><path d="M2 0h12l8 8v18a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" fill="#4285f4"/><path d="M14 0l8 8h-6a2 2 0 0 1-2-2z" fill="#a1c2fa"/><path d="M5 13h12M5 17h12M5 21h8" stroke="#fff" stroke-width="1.8"/></svg>';

  // ------------------------------------------------------------------ storage
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(NS + '.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(NS + '.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(NS + '.' + k); } catch (e) { /* ignore */ } },
    keys(prefix) {
      const out = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.indexOf(NS + '.' + prefix) === 0) out.push(k.slice(NS.length + 1));
        }
      } catch (e) { /* ignore */ }
      return out;
    },
  };

  const S = {
    bank: null,
    custom: ls.get('custom', []),
    progress: ls.get('progress', {}),
    sync: Object.assign({}, DEFAULT_SYNC, ls.get('sync', {})),
    ui: Object.assign({ tier: 0, status: 'all', blind: false, font: 'arial', size: 15, theme: 'system' }, ls.get('ui', {})),
    dirty: Object.assign({ progress: false, custom: false }, ls.get('dirty', {})),
    ver: { progress: 0, custom: 0 },
  };
  if (!Array.isArray(S.custom)) S.custom = [];
  const saveUi = () => ls.set('ui', S.ui);
  const saveDirty = () => ls.set('dirty', S.dirty);

  // ------------------------------------------------------------------ small helpers
  function h(tag, props) {
    const el = document.createElement(tag);
    if (props) {
      for (const k of Object.keys(props)) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'value' || k === 'checked' || k === 'selected' || k === 'disabled') el[k] = v;
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : String(v));
      }
    }
    for (let i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, kid) {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach((k) => append(el, k)); return; }
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  const icon = (name) => { const s = document.createElement('span'); s.innerHTML = I[name]; return s.firstChild; };
  const $ = (sel, root) => (root || document).querySelector(sel);
  const pad = (n) => String(n).padStart(2, '0');
  const fmtClock = (ts) => { const d = new Date(ts); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  function stableJSON(v) {
    const sort = (x) => {
      if (Array.isArray(x)) return x.map(sort);
      if (x && typeof x === 'object') { const o = {}; Object.keys(x).sort().forEach((k) => { o[k] = sort(x[k]); }); return o; }
      return x;
    };
    return JSON.stringify(sort(v), null, 1) + '\n';
  }
  const sameJSON = (a, b) => stableJSON(a) === stableJSON(b);
  function safeJSON(text, d) { try { const v = JSON.parse(text); return v == null ? d : v; } catch (e) { return d; } }
  function b64encode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64decode(b64) {
    const bin = atob(String(b64 || '').replace(/\s/g, ''));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  let toastTimer = null;
  function toast(msg) {
    let t = $('#toast');
    if (!t) { t = h('div', { id: 'toast', class: 'toast', role: 'status', 'aria-live': 'polite' }); document.body.append(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      try {
        const ta = h('textarea', { style: 'position:fixed;opacity:0' }); ta.value = text; document.body.append(ta); ta.select();
        const ok = document.execCommand('copy'); ta.remove(); return ok;
      } catch (e2) { return false; }
    }
  }

  // ------------------------------------------------------------------ data access
  const visibleCustom = () => S.custom.filter((q) => q && !q.deleted);
  const allQuestions = () => S.bank.questions.concat(visibleCustom());
  const qById = (id) => allQuestions().find((q) => q.id === id) || null;
  const patternById = (id) => S.bank.patterns.find((p) => p.id === id) || OWN_PATTERN;
  const questionsOf = (pid) => allQuestions().filter((q) => q.pattern === pid);
  const tierById = (id) => S.bank.tiers.find((t) => t.id === id) || { id: 0, label: 'Yours', heading: 'Your own questions', blurb: '' };
  const statusOf = (id) => (S.progress[id] && S.progress[id].s) || 'todo';
  function orderedQuestions() {
    const out = [];
    [1, 2, 3].forEach((t) => S.bank.patterns.filter((p) => p.tier === t).forEach((p) => out.push.apply(out, questionsOf(p.id))));
    out.push.apply(out, questionsOf('own'));
    return out;
  }
  function setStatus(id, s) {
    S.progress[id] = { s: s, u: Date.now() };
    ls.set('progress', S.progress);
    S.dirty.progress = true; S.ver.progress++; saveDirty();
    Sync.schedule('progress', () => Sync.syncProgress(), 1200);
  }
  const solKey = (id) => 'sol.' + id;
  const getSol = (id) => ls.get(solKey(id), null);
  const putSol = (id, rec) => ls.set(solKey(id), rec);
  const safeName = (id) => String(id).replace(/[^A-Za-z0-9_.-]/g, '_');

  // ------------------------------------------------------------------ GitHub client
  const GH = {
    base() { return 'https://api.github.com/repos/' + encodeURIComponent(S.sync.owner) + '/' + encodeURIComponent(S.sync.repo); },
    headers(json) {
      const h0 = { Authorization: 'Bearer ' + S.sync.token.trim(), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
      if (json) h0['Content-Type'] = 'application/json';
      return h0;
    },
    fileUrl(path) { return this.base() + '/contents/' + path.split('/').map(encodeURIComponent).join('/'); },
    async fail(r) {
      let msg = '';
      try { msg = (await r.json()).message || ''; } catch (e) { /* ignore */ }
      const err = new Error(msg || ('HTTP ' + r.status));
      err.status = r.status;
      if (r.status === 409 || (r.status === 422 && /sha/i.test(msg))) err.conflict = true;
      throw err;
    },
    async get(path) {
      const r = await fetch(this.fileUrl(path) + '?ref=' + encodeURIComponent(S.sync.branch), { headers: this.headers(), cache: 'no-store' });
      if (r.status === 404) return null;
      if (!r.ok) await this.fail(r);
      const j = await r.json();
      if (Array.isArray(j)) return null;
      return { sha: j.sha, text: b64decode(j.content) };
    },
    async put(path, text, sha, message) {
      const body = { message: message, content: b64encode(text), branch: S.sync.branch };
      if (sha) body.sha = sha;
      let r = await fetch(this.fileUrl(path), { method: 'PUT', headers: this.headers(true), body: JSON.stringify(body) });
      if (r.status === 422 && !sha) {
        // an empty repo has no branch yet; let GitHub create the default one
        const peek = await r.clone().json().catch(() => ({}));
        if (/branch/i.test(peek.message || '')) { delete body.branch; r = await fetch(this.fileUrl(path), { method: 'PUT', headers: this.headers(true), body: JSON.stringify(body) }); }
      }
      if (!r.ok) await this.fail(r);
      const j = await r.json();
      return j.content && j.content.sha;
    },
    async check() {
      const r = await fetch(this.base(), { headers: this.headers(), cache: 'no-store' });
      if (!r.ok) await this.fail(r);
      const j = await r.json();
      return { push: j.permissions ? !!j.permissions.push : true, private: !!j.private, name: j.full_name };
    },
  };
  function errMsg(e) {
    if (!e) return 'Unknown error';
    if (e.status === 401) return 'GitHub rejected the token. Paste a fresh one in Settings.';
    if (e.status === 403) return 'The token cannot write to this repo. Give it Contents: Read and write.';
    if (e.status === 404) return 'Repo not found, or the token cannot see it. Check Settings.';
    if (e.name === 'TypeError') return 'Offline. Everything is saved on this device and will sync later.';
    return e.message || String(e);
  }

  // one write at a time, so commits never race each other on the branch
  let chain = Promise.resolve();
  function enqueue(fn) { const p = chain.then(fn, fn); chain = p.catch(() => {}); return p; }

  // ------------------------------------------------------------------ sync
  function mergeMaps(local, remote) {
    const out = {};
    new Set(Object.keys(local).concat(Object.keys(remote))).forEach((k) => {
      const a = local[k], b = remote[k];
      out[k] = !b ? a : !a ? b : ((b.u || 0) > (a.u || 0) ? b : a);
    });
    return out;
  }
  function mergeLists(local, remote) {
    const m = mergeMaps(Object.fromEntries(local.map((x) => [x.id, x])), Object.fromEntries(remote.map((x) => [x.id, x])));
    const order = local.map((x) => x.id);
    remote.forEach((x) => { if (order.indexOf(x.id) < 0) order.push(x.id); });
    return order.map((id) => m[id]).filter(Boolean);
  }
  function serializeSol(id, rec) {
    const q = qById(id);
    const meta = { id: id, updated: rec.u, title: q ? q.title : id };
    if (q && q.leetcode && q.leetcode.number) meta.leetcode = q.leetcode.number;
    return '<!-- loop-drills ' + JSON.stringify(meta) + ' -->\n' + rec.t;
  }
  function parseSolFile(text) {
    const m = /^<!-- loop-drills (\{.*?\}) -->\r?\n?/.exec(text);
    if (!m) return { t: text, u: 0 };
    const meta = safeJSON(m[1], {});
    return { t: text.slice(m[0].length), u: Number(meta.updated) || 0 };
  }

  const Sync = {
    state: 'local', msg: '', last: ls.get('lastSync', 0), inflight: 0, timers: {}, lastPull: 0,
    enabled() { return !!(S.sync.token && S.sync.owner && S.sync.repo && S.sync.branch); },
    anyDirty() {
      return S.dirty.progress || S.dirty.custom || ls.keys('sol.').some((k) => { const r = ls.get(k, null); return r && r.d; });
    },
    setState(state, msg) { this.state = state; this.msg = msg || ''; renderPill(); refreshDocState(); },
    refresh() {
      if (!this.enabled()) return this.setState('local');
      if (this.inflight) return this.setState('saving');
      if (this.state === 'error') return this.setState('error', this.msg);
      this.setState(this.anyDirty() ? 'pending' : 'ok', this.msg);
    },
    async run(fn) {
      if (!this.enabled()) { this.refresh(); return null; }
      this.inflight++;
      this.setState('saving');
      try {
        const out = await enqueue(fn);
        this.inflight--;
        this.last = Date.now(); ls.set('lastSync', this.last);
        this.state = 'ok'; this.msg = '';
        this.refresh();
        return out;
      } catch (e) {
        this.inflight--;
        if (e && e.name === 'TypeError') { this.state = 'pending'; this.setState('pending', errMsg(e)); }
        else this.setState('error', errMsg(e));
        return null;
      }
    },
    schedule(key, fn, ms) {
      clearTimeout(this.timers[key]);
      this.refresh();
      this.timers[key] = setTimeout(() => { delete this.timers[key]; fn(); }, ms);
    },
    flushKey(key) {
      if (this.timers[key]) { clearTimeout(this.timers[key]); delete this.timers[key]; }
    },
    syncProgress() {
      return this.run(async () => {
        for (let attempt = 0; attempt < 4; attempt++) {
          const ver = S.ver.progress;
          const remote = await GH.get('progress.json');
          const rmap = remote ? safeJSON(remote.text, {}) : {};
          const merged = mergeMaps(S.progress, rmap);
          if (!sameJSON(merged, S.progress)) { S.progress = merged; ls.set('progress', merged); onDataChanged(); }
          if (!remote || !sameJSON(merged, rmap)) {
            try { await GH.put('progress.json', stableJSON(merged), remote && remote.sha, 'Update progress'); }
            catch (e) { if (e.conflict && attempt < 3) continue; throw e; }
          }
          if (ver === S.ver.progress) { S.dirty.progress = false; saveDirty(); }
          return true;
        }
      });
    },
    syncCustom() {
      return this.run(async () => {
        for (let attempt = 0; attempt < 4; attempt++) {
          const ver = S.ver.custom;
          const remote = await GH.get('questions/custom.json');
          let rlist = remote ? safeJSON(remote.text, []) : [];
          if (!Array.isArray(rlist)) rlist = [];
          const merged = mergeLists(S.custom, rlist);
          if (!sameJSON(merged, S.custom)) { S.custom = merged; ls.set('custom', merged); onDataChanged(); }
          if (!remote || !sameJSON(merged, rlist)) {
            try { await GH.put('questions/custom.json', JSON.stringify(merged, null, 1) + '\n', remote && remote.sha, 'Update your questions'); }
            catch (e) { if (e.conflict && attempt < 3) continue; throw e; }
          }
          if (ver === S.ver.custom) { S.dirty.custom = false; saveDirty(); }
          return true;
        }
      });
    },
    syncSolution(id) {
      return this.run(async () => {
        const path = 'solutions/' + safeName(id) + '.md';
        for (let attempt = 0; attempt < 4; attempt++) {
          const local = getSol(id);
          const remote = await GH.get(path);
          const r = remote ? parseSolFile(remote.text) : null;
          if (r && (!local || r.u > local.u)) {
            putSol(id, { t: r.t, u: r.u, d: false });
            onSolutionPulled(id, r);
            return 'pulled';
          }
          if (!local || !local.d) return 'clean';
          const markClean = () => { const cur = getSol(id); if (cur && cur.u === local.u) { cur.d = false; putSol(id, cur); } };
          if ((r && r.u === local.u && r.t === local.t) || (!r && !local.t)) { markClean(); return 'same'; }
          try {
            const q = qById(id);
            await GH.put(path, serializeSol(id, local), remote && remote.sha, 'Solution: ' + (q ? q.title : id));
            markClean();
            return 'pushed';
          } catch (e) { if (e.conflict && attempt < 3) continue; throw e; }
        }
      });
    },
    async flushAll() {
      if (!this.enabled()) return this.refresh();
      Object.keys(this.timers).forEach((k) => this.flushKey(k));
      if (S.dirty.progress) await this.syncProgress();
      if (S.dirty.custom) await this.syncCustom();
      for (const k of ls.keys('sol.')) { const r = ls.get(k, null); if (r && r.d) await this.syncSolution(k.slice(4)); }
      this.refresh();
    },
    async pullAll() {
      if (!this.enabled()) return this.refresh();
      this.lastPull = Date.now();
      await this.syncProgress();
      await this.syncCustom();
      await this.flushAll();
      if (route.view === 'q' && route.id) this.syncSolution(route.id);
    },
  };

  function onDataChanged() {
    if (route.view === 'home') renderHome(true);
    if (route.view === 'q' && route.ctx && route.ctx.refreshStatus) route.ctx.refreshStatus();
  }
  function onSolutionPulled(id, r) {
    if (route.view !== 'q' || route.id !== id || !route.ctx || !route.ctx.editor) return;
    route.ctx.editor.load(r.t, true);
  }

  // ------------------------------------------------------------------ theme
  function applyTheme() {
    if (S.ui.theme === 'light' || S.ui.theme === 'dark') document.documentElement.setAttribute('data-theme', S.ui.theme);
    else document.documentElement.removeAttribute('data-theme');
  }

  // ------------------------------------------------------------------ chrome
  function renderPill() {
    const p = $('#sync-pill');
    if (!p) return;
    const st = Sync.state;
    p.setAttribute('data-state', st);
    const txt = st === 'local' ? 'This device only' : st === 'saving' ? 'Saving' : st === 'pending' ? (Sync.msg ? 'Offline' : 'Unsynced changes') : st === 'error' ? 'Sync problem' : 'Synced';
    p.innerHTML = '';
    append(p, h('span', { class: 'lbl-short', text: txt }));
    if (st === 'ok' && Sync.last) append(p, h('span', { class: 'lbl-long', text: ' ' + fmtClock(Sync.last) }));
    p.title = Sync.msg || (st === 'local' ? 'Solutions are saved in this browser. Set up GitHub sync in Settings to use them on your phone too.' : 'GitHub sync');
  }
  function topbar() {
    return h('header', { class: 'topbar' },
      h('div', { class: 'topbar-in' },
        h('a', { class: 'brand', href: '#/' }, h('span', { class: 'brand-mark', html: I.logo }), h('span', { class: 'brand-name', text: 'Loop Drills' })),
        h('span', { class: 'spacer' }),
        h('a', { id: 'sync-pill', class: 'sync-pill', href: '#/settings' }),
        h('nav', { class: 'nav', 'aria-label': 'Main' },
          h('button', { class: 'icon-btn', type: 'button', title: 'Random unsolved question, pattern hidden', onclick: surprise }, icon('shuffle'), h('span', { class: 'lbl', text: 'Surprise me' })),
          h('a', { class: 'icon-btn', href: '#/add', title: 'Add a question' }, icon('plus'), h('span', { class: 'lbl', text: 'Add' })),
          h('a', { class: 'icon-btn', href: '#/settings', title: 'Settings and sync', 'aria-label': 'Settings' }, icon('gear')))));
  }
  function surprise() {
    let pool = orderedQuestions().filter((q) => statusOf(q.id) !== 'solved');
    if (!pool.length) pool = orderedQuestions();
    const q = pool[Math.floor(Math.random() * pool.length)];
    if (q) location.hash = '#/q/' + encodeURIComponent(q.id) + '/blind';
  }
  function mount(main) {
    const app = $('#app');
    app.innerHTML = '';
    app.append(topbar(), main);
    renderPill();
  }

  // ------------------------------------------------------------------ home
  let homeScroll = 0;
  function renderHome(keepScroll) {
    const y = window.scrollY;
    const main = h('main', { class: 'page' });
    const col = h('div', { class: 'col' });
    main.append(col);
    const qs = allQuestions();
    const count = (arr, s) => arr.filter((q) => statusOf(q.id) === s).length;
    const solved = count(qs, 'solved'), att = count(qs, 'attempted');
    const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0) + '%';

    col.append(h('header', null,
      h('div', { class: 'eyebrow', text: 'Google loop practice · ' + S.bank.patterns.length + ' patterns · ' + qs.length + ' questions' }),
      h('h1', { class: 'page-title', text: 'Loop Drills' }),
      h('p', { class: 'lede', text: 'Every problem is told the way a Google interviewer would tell it: a situation, no constraints, no sample input. Write your answer in the doc, peek at constraints, follow-ups or one hint only when you need to, then submit on LeetCode.' })));

    const stat = (label, c, n, d, attN) => h('div', { class: 'stat', style: '--c:' + c },
      h('div', { class: 'stat-h' }, h('span', null, h('i', { class: 'dot' }), label), h('b', { text: n + ' / ' + d })),
      h('div', { class: 'bar' }, h('i', { style: 'width:' + pct(n, d) }), attN ? h('i', { class: 'att', style: 'width:' + pct(attN, d) }) : null));
    const diffStats = ['Medium', 'Hard'].map((dname) => { const a = qs.filter((q) => q.difficulty === dname); return stat(dname, dname === 'Medium' ? 'var(--med)' : 'var(--hard)', count(a, 'solved'), a.length); });
    const tierStats = [1, 2, 3].map((t) => {
      const a = qs.filter((q) => patternById(q.pattern).tier === t);
      return stat('Priority ' + t + ' · ' + tierById(t).label, 'var(--t' + t + ')', count(a, 'solved'), a.length);
    });
    col.append(h('section', { class: 'card summary', 'aria-label': 'Progress' },
      h('div', { class: 'sum-top' },
        h('div', { class: 'sum-big' }, String(solved), h('small', { text: 'of ' + qs.length + ' solved' })),
        h('div', { class: 'sum-sub', text: att + ' attempted · ' + (qs.length - solved - att) + ' to go' })),
      h('div', { class: 'bar', role: 'img', 'aria-label': solved + ' solved, ' + att + ' attempted' }, h('i', { style: 'width:' + pct(solved, qs.length) }), h('i', { class: 'att', style: 'width:' + pct(att, qs.length) })),
      h('hr', { class: 'div' }),
      h('div', { class: 'stats' }, diffStats),
      h('div', { class: 'stats' }, tierStats)));

    const next = orderedQuestions().find((q) => statusOf(q.id) === 'attempted') || orderedQuestions().find((q) => statusOf(q.id) === 'todo');
    if (next) {
      const p = patternById(next.pattern);
      col.append(h('section', { class: 'card next-up', 'aria-label': 'Next up' },
        h('div', { class: 'nu-txt' },
          h('span', { class: 'eyebrow', text: statusOf(next.id) === 'attempted' ? 'Pick up where you left off' : 'Next in your order' }),
          h('span', { class: 'nu-title', text: next.title }),
          h('span', { class: 'nu-meta', text: p.name + ' · ' + next.difficulty })),
        h('a', { class: 'icon-btn primary', href: '#/q/' + encodeURIComponent(next.id) }, 'Open', icon('right'))));
    }

    const seg = (key, opts, label) => h('div', { class: 'seg', role: 'group', 'aria-label': label },
      opts.map(([v, t]) => h('button', { type: 'button', 'aria-pressed': String(S.ui[key] === v), text: t, onclick: () => { S.ui[key] = v; saveUi(); renderHome(true); } })));
    col.append(h('div', { class: 'controls' },
      seg('tier', [[0, 'All'], [1, 'Start now'], [2, 'Next'], [3, 'Later']], 'Filter by priority'),
      seg('status', [['all', 'Any status'], ['todo', 'To do'], ['attempted', 'Attempted'], ['solved', 'Solved']], 'Filter by status'),
      h('label', { class: 'switch', for: 'blind-toggle' },
        h('input', { type: 'checkbox', id: 'blind-toggle', checked: S.ui.blind, onchange: (e) => { S.ui.blind = e.target.checked; saveUi(); } }),
        'Blind mode: hide pattern and difficulty while solving')));

    let rank = 0;
    let shown = 0;
    const tiers = S.bank.tiers.map((t) => t.id);
    const ownQs = questionsOf('own');
    if (ownQs.length) tiers.push(0);
    tiers.forEach((tid) => {
      const pats = tid === 0 ? [OWN_PATTERN] : S.bank.patterns.filter((p) => p.tier === tid);
      const tier = tierById(tid);
      const sec = h('section', { class: 'tier tier-' + tid });
      sec.append(h('div', { class: 'tier-head' },
        h('div', { class: 'tier-label', text: tid ? 'Priority ' + tid + ' · ' + tier.label : 'Added by you' }),
        h('h2', { text: tier.heading }),
        tier.blurb ? h('p', { text: tier.blurb }) : null));
      let any = false;
      pats.forEach((p) => {
        if (tid) rank++;
        const pq = questionsOf(p.id);
        if (!pq.length) return;
        const done = count(pq, 'solved');
        const list = pq.filter((q) => S.ui.status === 'all' || statusOf(q.id) === S.ui.status);
        const tierOk = S.ui.tier === 0 || S.ui.tier === tid;
        if (!tierOk || !list.length) return;
        any = true; shown += list.length;
        sec.append(h('article', { class: 'card pcard' + (done === pq.length ? ' done' : ''), id: 'p-' + p.id },
          h('div', { class: 'pcard-head' },
            h('div', { class: 'rank', text: tid ? pad(rank) : '+' }),
            h('div', { class: 'ptitle' }, h('h3', { text: p.name }), h('p', { class: 'signal', text: p.signal }), p.mirror ? h('div', { class: 'mirror', text: 'Mirrors your Google problem: ' + p.mirror }) : null),
            h('div', { class: 'pcount' }, h('span', { text: done + ' / ' + pq.length }), h('div', { class: 'bar' }, h('i', { style: 'width:' + pct(done, pq.length) })))),
          h('ul', { class: 'qlist' }, list.map(questionRow))));
      });
      if (any) col.append(sec);
    });
    if (!shown) col.append(h('div', { class: 'empty', text: 'Nothing matches these filters.' }));
    col.append(h('p', { class: 'foot', text: 'Constraints come from LeetCode. Stories, follow-ups and hints are written for practice and are not real Google questions word for word.' }));
    mount(main);
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, homeScroll || 0);
  }
  function questionRow(q) {
    const st = statusOf(q.id);
    const next = st === 'solved' ? 'todo' : 'solved';
    return h('li', { class: 'qrow ' + st, 'data-st': st },
      h('button', { class: 'st-btn', type: 'button', title: 'Mark as ' + STATUS_LABEL[next].toLowerCase(), 'aria-label': q.title + ': ' + STATUS_LABEL[st] + '. Mark as ' + STATUS_LABEL[next].toLowerCase(),
        onclick: () => { setStatus(q.id, next); renderHome(true); } },
        h('span', { class: 'st-ico', html: I.check })),
      h('a', { href: '#/q/' + encodeURIComponent(q.id), text: q.title }),
      h('span', { class: 'tags' }, q.source === 'custom' ? h('span', { class: 'chip yours', text: 'Yours' }) : null, h('span', { class: 'chip ' + q.difficulty, text: q.difficulty })));
  }

  // ------------------------------------------------------------------ question room
  function Timer() {
    let left = TIMER_SECONDS, running = false, iv = null, lastTick = 0;
    const t = h('span', { class: 't', 'aria-live': 'off' });
    const playBtn = h('button', { type: 'button', 'aria-label': 'Start timer', title: 'Start 45-minute timer', html: I.play });
    const resetBtn = h('button', { type: 'button', 'aria-label': 'Reset timer', title: 'Reset', html: I.reset });
    const wrap = h('div', { class: 'timer', title: '45 minutes, like a real round' }, t, playBtn, resetBtn);
    const draw = () => {
      const s = Math.abs(Math.round(left));
      t.textContent = (left < 0 ? '+' : '') + pad(Math.floor(s / 60)) + ':' + pad(s % 60);
      wrap.classList.toggle('over', left < 0);
      playBtn.innerHTML = running ? I.pause : I.play;
      playBtn.setAttribute('aria-label', running ? 'Pause timer' : 'Start timer');
    };
    const tick = () => { const now = Date.now(); left -= (now - lastTick) / 1000; lastTick = now; draw(); };
    playBtn.addEventListener('click', () => {
      running = !running;
      if (running) { lastTick = Date.now(); iv = setInterval(tick, 250); } else { clearInterval(iv); tick(); }
      draw();
    });
    resetBtn.addEventListener('click', () => { running = false; clearInterval(iv); left = TIMER_SECONDS; draw(); });
    draw();
    return { el: wrap, stop: () => clearInterval(iv) };
  }

  function Editor(q) {
    const rec = getSol(q.id);
    const ta = h('textarea', {
      id: 'doc-' + safeName(q.id), spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off', 'aria-label': 'Your solution',
      placeholder: 'Start typing. Like a Google Doc in a real interview, there is no autocomplete, highlighting or auto-indent.\n\nClarifying questions, approach, complexity, then code.',
    });
    ta.value = rec ? rec.t : '';
    let saveT = null, touched = false, tabOut = false;
    const page = h('div', { class: 'doc-page' }, ta);
    const stateEl = h('span', { class: 'save-state' });
    const countEl = h('span');
    const noticeEl = h('div', { class: 'notice', hidden: true });

    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.max(ta.scrollHeight, 200) + 'px'; };
    const counts = () => {
      const v = ta.value;
      const lines = v ? v.split('\n').length : 0;
      const words = (v.match(/\S+/g) || []).length;
      countEl.textContent = lines + ' lines · ' + words + ' words · ' + v.length + ' chars';
    };
    const applyFont = () => {
      page.style.setProperty('--doc-font', FONTS[S.ui.font] || FONTS.arial);
      page.style.setProperty('--doc-size', (S.ui.size || 15) + 'px');
      requestAnimationFrame(fit);
    };
    const persist = () => {
      clearTimeout(saveT); saveT = null;
      const cur = getSol(q.id);
      if (cur && cur.t === ta.value) return;
      putSol(q.id, { t: ta.value, u: Date.now(), d: true });
      Sync.schedule('sol:' + q.id, () => Sync.syncSolution(q.id), 2500);
      refreshDocState();
    };
    const insert = (text) => {
      ta.focus();
      const done = document.execCommand && (text ? document.execCommand('insertText', false, text) : document.execCommand('delete'));
      if (!done) {
        const s = ta.selectionStart, e = ta.selectionEnd;
        ta.setRangeText(text, s, e, 'end');
        ta.dispatchEvent(new Event('input'));
      }
    };
    ta.addEventListener('input', () => {
      touched = true;
      fit(); counts();
      clearTimeout(saveT); saveT = setTimeout(persist, 300);
      if (Sync.enabled()) { stateEl.textContent = 'Editing'; stateEl.setAttribute('data-state', 'pending'); }
    });
    ta.addEventListener('blur', () => { persist(); if (Sync.enabled()) { Sync.flushKey('sol:' + q.id); Sync.syncSolution(q.id); } });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { tabOut = true; return; }
      if (e.key === 'Tab' && !tabOut && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (e.shiftKey) {
          const v = ta.value, s = ta.selectionStart;
          const ls0 = v.lastIndexOf('\n', s - 1) + 1;
          const m = /^ {1,4}/.exec(v.slice(ls0));
          if (m) { ta.setSelectionRange(ls0, ls0 + m[0].length); insert(''); }
        } else insert('    ');
        return;
      }
      tabOut = false;
    });

    const fontSel = h('select', { 'aria-label': 'Font', title: 'Font', onchange: (e) => { S.ui.font = e.target.value; saveUi(); applyFont(); } },
      Object.keys(FONTS).map((k) => h('option', { value: k, selected: S.ui.font === k, text: FONT_LABEL[k] })));
    const sizeSel = h('select', { 'aria-label': 'Font size', title: 'Font size', onchange: (e) => { S.ui.size = Number(e.target.value); saveUi(); applyFont(); } },
      SIZES.map((n) => h('option', { value: String(n), selected: Number(S.ui.size) === n, text: String(n) })));
    const copyBtn = h('button', { class: 'icon-btn', type: 'button', title: 'Copy everything to paste into LeetCode', onclick: async () => { toast((await copyText(ta.value)) ? 'Copied the whole doc' : 'Copy failed. Select the text and copy it manually.'); } }, icon('copy'), h('span', { class: 'lbl', text: 'Copy' }));
    const saveBtn = h('button', { class: 'icon-btn', type: 'button', title: 'Save to GitHub now', onclick: async () => {
      persist();
      if (!Sync.enabled()) { toast('Saved on this device. Set up sync in Settings to reach it from your phone.'); return; }
      Sync.flushKey('sol:' + q.id);
      await Sync.syncSolution(q.id);
      toast(Sync.state === 'error' ? Sync.msg : 'Saved to GitHub');
    } }, icon('cloud'), h('span', { class: 'lbl', text: 'Save' }));

    const el = h('section', { class: 'doc', 'aria-label': 'Solution document' },
      h('div', { class: 'doc-bar' },
        h('div', { class: 'doc-name' }, h('span', { html: DOC_ICON }), h('div', { class: 'nm' }, h('b', { text: 'Solution · ' + q.title }), stateEl)),
        h('div', { class: 'doc-tools' }, fontSel, sizeSel, copyBtn, saveBtn)),
      h('div', { class: 'doc-scroll' }, noticeEl, page),
      h('div', { class: 'doc-foot' }, countEl, h('span', { text: 'Tab indents · Esc then Tab leaves the doc' })));
    if (noticeEl) noticeEl.style.cssText = 'max-width:816px;margin:0 auto 12px';

    function refresh() {
      const cur = getSol(q.id);
      let st = 'ok', txt;
      if (!Sync.enabled()) { txt = 'Saved on this device'; st = 'local'; }
      else if (cur && cur.d) {
        if (Sync.state === 'saving') { txt = 'Saving to GitHub'; st = 'pending'; }
        else if (Sync.state === 'error') { txt = 'Not synced: ' + Sync.msg; st = 'error'; }
        else if (Sync.msg) { txt = 'Offline, saved on this device'; st = 'pending'; }
        else { txt = 'Unsaved changes, syncing shortly'; st = 'pending'; }
      } else if (Sync.state === 'error') { txt = 'Sync problem: ' + Sync.msg; st = 'error'; }
      else txt = (cur && cur.t ? 'Saved to GitHub' : 'Connected to GitHub') + (Sync.last ? ' · ' + fmtClock(Sync.last) : '');
      stateEl.textContent = txt;
      stateEl.setAttribute('data-state', st);
    }
    applyFont(); counts(); refresh();
    return {
      el, refresh,
      fit: () => requestAnimationFrame(fit),
      flush: () => { persist(); },
      load(text, fromRemote) {
        if (ta.value === text) return;
        const focused = document.activeElement === ta;
        if (touched && focused) return;
        ta.value = text; fit(); counts();
        if (fromRemote) { noticeEl.textContent = 'Loaded the newer version you saved on another device.'; noticeEl.hidden = false; }
        refresh();
      },
    };
  }
  function refreshDocState() { if (route.view === 'q' && route.ctx && route.ctx.editor) route.ctx.editor.refresh(); }

  function reveal(cls, iconName, title, sub, body, open) {
    return h('details', { class: 'rv ' + cls, open: !!open },
      h('summary', null, h('span', { class: 'rv-ico', html: I[iconName] }), h('span', { text: title }), sub ? h('span', { class: 'rv-sub', text: sub }) : null, icon('chev')),
      h('div', { class: 'rv-body' }, body));
  }

  function renderQuestion(id, blindRoute) {
    const q = qById(id);
    if (!q) {
      mount(h('main', { class: 'page' }, h('div', { class: 'col' }, h('div', { class: 'empty' }, 'That question does not exist anymore. ', h('a', { href: '#/', text: 'Back to the list' })))));
      return;
    }
    const blind = blindRoute || S.ui.blind;
    const p = patternById(q.pattern);
    const tier = tierById(p.tier);
    const siblings = questionsOf(q.pattern);
    const idx = siblings.findIndex((x) => x.id === q.id);
    const prev = blind ? null : siblings[idx - 1], next = blind ? null : siblings[idx + 1];

    const statusSeg = h('div', { class: 'seg status-seg', role: 'group', 'aria-label': 'Status' });
    const drawStatus = () => {
      statusSeg.innerHTML = '';
      ['todo', 'attempted', 'solved'].forEach((s) => statusSeg.append(h('button', {
        type: 'button', 'data-v': s, 'aria-pressed': String(statusOf(q.id) === s), text: STATUS_LABEL[s],
        onclick: () => { setStatus(q.id, s); drawStatus(); },
      })));
    };
    drawStatus();
    const timer = Timer();
    const editor = Editor(q);

    const lc = q.leetcode && q.leetcode.url ? q.leetcode : null;
    const reveals = h('div', { class: 'reveals' },
      reveal('rv-cons', 'ruler', 'Constraints', 'LeetCode', q.constraints && q.constraints.length ? h('ul', null, q.constraints.map((c) => h('li', { text: c }))) : h('p', { text: 'No constraints recorded for this one.' })),
      reveal('rv-fu', 'chat', 'Follow-ups the interviewer might ask', (q.followups || []).length ? String(q.followups.length) : '', (q.followups || []).length ? h('ul', null, q.followups.map((c) => h('li', { text: c }))) : h('p', { text: 'No follow-ups recorded yet.' })),
      reveal('rv-hint', 'bulb', 'One hint', 'Not the full idea', h('p', { text: q.hint || 'No hint recorded for this one.' })),
      lc ? reveal('rv-lc', 'code', 'Which LeetCode problem is this?', 'Spoiler', h('div', { class: 'lc-name' }, lc.number ? h('b', { text: '#' + lc.number }) : null, h('span', { text: lc.title || lc.url }), h('a', { href: lc.url, target: '_blank', rel: 'noopener', text: 'Open' }))) : null,
      blind ? reveal('rv-pat', 'eye', 'Pattern and difficulty', 'Hidden in blind mode', h('p', null, h('b', { text: p.name }), ' · ' + q.difficulty)) : null);

    const prompt = h('section', { class: 'card prompt', 'aria-label': 'Problem' },
      h('div', { class: 'crumbs' },
        h('a', { href: '#/' }, icon('back'), 'All questions'),
        blind ? null : [h('span', { class: 'sep', text: '/' }), h('span', { text: p.tier ? 'Priority ' + p.tier + ' · ' + tier.label : 'Yours' }), h('span', { class: 'sep', text: '/' }), h('a', { href: '#/', onclick: () => { homeScroll = 0; setTimeout(() => { const t = document.getElementById('p-' + p.id); if (t) t.scrollIntoView(); }, 30); }, text: p.name })]),
      h('div', { class: 'q-meta' },
        blind ? h('span', { class: 'chip muted', text: 'Blind' }) : h('span', { class: 'chip ' + q.difficulty, text: q.difficulty }),
        q.source === 'custom' ? h('span', { class: 'chip yours', text: 'Yours' }) : null),
      h('h1', { class: 'q-title', text: q.title }),
      h('div', { class: 'story' }, (q.story || []).map((para) => h('p', { text: para }))),
      h('div', { class: 'actions' }, statusSeg, timer.el,
        lc ? h('a', { class: 'icon-btn primary lc-btn', href: lc.url, target: '_blank', rel: 'noopener', title: 'Opens the matching LeetCode problem in a new tab' }, 'Submit on LeetCode', icon('ext')) : null),
      reveals,
      q.source === 'custom' ? h('div', { class: 'own-actions' },
        h('a', { class: 'icon-btn', href: '#/edit/' + encodeURIComponent(q.id) }, icon('pencil'), 'Edit question'),
        deleteButton(q)) : null,
      (prev || next) ? h('nav', { class: 'pn', 'aria-label': 'More in this pattern' },
        prev ? h('a', { href: '#/q/' + encodeURIComponent(prev.id) }, icon('left'), h('span', { text: prev.title })) : h('span'),
        next ? h('a', { href: '#/q/' + encodeURIComponent(next.id) }, h('span', { text: next.title }), icon('right')) : h('span')) : null);

    const main = h('main', { class: 'page' }, h('div', { class: 'room' }, prompt, editor.el));
    mount(main);
    window.scrollTo(0, 0);
    editor.fit();
    route.ctx = {
      editor,
      refreshStatus: drawStatus,
      cleanup: () => { timer.stop(); editor.flush(); if (Sync.enabled() && Sync.timers['sol:' + q.id]) { Sync.flushKey('sol:' + q.id); Sync.syncSolution(q.id); } },
    };
    if (Sync.enabled()) Sync.syncSolution(q.id);
  }
  function deleteButton(q) {
    let armed = false;
    const b = h('button', { class: 'icon-btn', type: 'button' }, icon('trash'), h('span', { text: 'Delete question' }));
    b.addEventListener('click', () => {
      if (!armed) { armed = true; b.lastChild.textContent = 'Click again to delete'; setTimeout(() => { armed = false; b.lastChild.textContent = 'Delete question'; }, 4000); return; }
      const i = S.custom.findIndex((x) => x.id === q.id);
      if (i >= 0) S.custom[i] = { id: q.id, deleted: true, u: Date.now() };
      ls.set('custom', S.custom); S.dirty.custom = true; S.ver.custom++; saveDirty();
      Sync.syncCustom();
      toast('Question deleted');
      location.hash = '#/';
    });
    return b;
  }

  // ------------------------------------------------------------------ add / edit
  function renderEdit(id) {
    const existing = id ? S.custom.find((x) => x.id === id && !x.deleted) : null;
    if (id && !existing) { location.hash = '#/'; return; }
    const v = existing || { pattern: 'own', difficulty: 'Medium', title: '', story: [], constraints: [], followups: [], hint: '', leetcode: { url: '' } };
    const f = (label, input, help) => h('div', { class: 'field' }, h('label', { for: input.id, text: label }), input, help ? h('span', { class: 'help', text: help }) : null);
    const title = h('input', { type: 'text', id: 'f-title', value: v.title, maxlength: '120', placeholder: 'A short name for the situation, e.g. "Busiest conference room"' });
    const pattern = h('select', { id: 'f-pattern' },
      h('option', { value: 'own', text: 'Not sure yet (Your own questions)', selected: v.pattern === 'own' }),
      S.bank.tiers.map((t) => h('optgroup', { label: 'Priority ' + t.id + ' · ' + t.label }, S.bank.patterns.filter((p) => p.tier === t.id).map((p) => h('option', { value: p.id, text: p.name, selected: v.pattern === p.id })))));
    const diff = h('select', { id: 'f-diff' }, ['Medium', 'Hard', 'Easy'].map((d) => h('option', { value: d, text: d, selected: v.difficulty === d })));
    const story = h('textarea', { id: 'f-story', class: 'tall', placeholder: 'Tell it like an interviewer would. Leave a blank line between paragraphs. No constraints, no sample input/output.' });
    story.value = (v.story || []).join('\n\n');
    const url = h('input', { type: 'url', id: 'f-url', value: (v.leetcode && v.leetcode.url) || '', placeholder: 'https://leetcode.com/problems/...' });
    const cons = h('textarea', { id: 'f-cons', placeholder: 'One per line, e.g. 1 ≤ n ≤ 10⁵' });
    cons.value = (v.constraints || []).join('\n');
    const fus = h('textarea', { id: 'f-fu', placeholder: 'One per line' });
    fus.value = (v.followups || []).join('\n');
    const hint = h('textarea', { id: 'f-hint', placeholder: 'One nudge that does not give the whole idea away' });
    hint.value = v.hint || '';
    const err = h('p', { class: 'err-text', role: 'alert' });

    const save = (e) => {
      e.preventDefault();
      const lines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean);
      const paras = story.value.split(/\n\s*\n/).map((x) => x.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
      if (!title.value.trim()) { err.textContent = 'Give the question a title.'; title.focus(); return; }
      if (!paras.length) { err.textContent = 'Write the story: that is the question you will read.'; story.focus(); return; }
      const u = url.value.trim();
      if (u && !/^https:\/\//i.test(u)) { err.textContent = 'The LeetCode link should start with https://'; url.focus(); return; }
      const num = (/leetcode\.com\/problems\/([a-z0-9-]+)/i.exec(u) || [])[1];
      const q = {
        id: existing ? existing.id : 'c-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        pattern: pattern.value, difficulty: diff.value, title: title.value.trim(), story: paras,
        constraints: lines(cons.value), followups: lines(fus.value), hint: hint.value.trim(),
        leetcode: u ? { url: u, title: num ? num.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '' } : null,
        source: 'custom', created: existing ? existing.created : Date.now(), u: Date.now(),
      };
      const i = S.custom.findIndex((x) => x.id === q.id);
      if (i >= 0) S.custom[i] = q; else S.custom.push(q);
      ls.set('custom', S.custom); S.dirty.custom = true; S.ver.custom++; saveDirty();
      Sync.syncCustom();
      toast(existing ? 'Question updated' : 'Question added');
      location.hash = '#/q/' + encodeURIComponent(q.id);
    };

    const main = h('main', { class: 'page' }, h('div', { class: 'col' },
      h('header', null,
        h('div', { class: 'eyebrow', text: existing ? 'Edit your question' : 'Add a question' }),
        h('h1', { class: 'page-title', text: existing ? 'Edit question' : 'New question' }),
        h('p', { class: 'lede', text: 'Questions you add here are saved to your private data repo and show up on every device. Claude can also add questions straight into the shared bank when you ask.' })),
      h('form', { class: 'card form', onsubmit: save, novalidate: true },
        f('Title', title),
        h('div', { class: 'row2' }, f('Pattern', pattern), f('Difficulty', diff)),
        f('The question, as the interviewer tells it', story, 'Blank line = new paragraph.'),
        f('LeetCode link (optional)', url, 'Used for the Submit on LeetCode button.'),
        f('Constraints (hidden until you open them)', cons),
        f('Possible follow-ups (hidden)', fus),
        f('One hint (hidden)', hint),
        err,
        h('div', { class: 'form-actions' },
          h('button', { class: 'icon-btn primary', type: 'submit' }, existing ? 'Save changes' : 'Add question'),
          h('a', { class: 'icon-btn', href: existing ? '#/q/' + encodeURIComponent(existing.id) : '#/' }, 'Cancel')))));
    mount(main);
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ settings
  function setupLink() {
    const payload = { o: S.sync.owner, r: S.sync.repo, b: S.sync.branch, t: S.sync.token };
    const enc = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return location.origin + location.pathname + '#setup=' + enc;
  }
  function renderSettings() {
    const f = (label, input, help) => h('div', { class: 'field' }, h('label', { for: input.id, text: label }), input, help ? h('span', { class: 'help', html: help }) : null);
    const owner = h('input', { type: 'text', id: 's-owner', value: S.sync.owner, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    const repo = h('input', { type: 'text', id: 's-repo', value: S.sync.repo, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    const branch = h('input', { type: 'text', id: 's-branch', value: S.sync.branch, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
    const token = h('input', { type: 'password', id: 's-token', value: S.sync.token, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'github_pat_...' });
    const showTok = h('label', { class: 'switch', for: 's-show' }, h('input', { type: 'checkbox', id: 's-show', onchange: (e) => { token.type = e.target.checked ? 'text' : 'password'; } }), 'Show token');
    const result = h('p', { class: 'conn', role: 'status' });
    const status = () => {
      result.innerHTML = '';
      if (!Sync.enabled()) { result.append(h('span', { class: 'chip muted', text: 'Not connected' }), 'Solutions are kept in this browser only.'); return; }
      const cls = Sync.state === 'error' ? 'err-text' : 'ok-text';
      result.append(h('span', { class: 'chip ' + (Sync.state === 'error' ? 'Hard' : 'Easy'), text: Sync.state === 'error' ? 'Problem' : 'Connected' }),
        h('span', { class: cls, text: Sync.state === 'error' ? Sync.msg : (S.sync.owner + '/' + S.sync.repo + (Sync.last ? ' · last sync ' + fmtClock(Sync.last) : '')) }));
    };
    const connect = async (e) => {
      e.preventDefault();
      S.sync = { owner: owner.value.trim(), repo: repo.value.trim(), branch: branch.value.trim() || 'main', token: token.value.trim() };
      ls.set('sync', S.sync);
      if (!Sync.enabled()) { Sync.refresh(); status(); toast('Sync is off. Everything stays on this device.'); return; }
      result.textContent = 'Checking...';
      try {
        const info = await GH.check();
        if (!info.push) { Sync.setState('error', 'The token can read ' + info.name + ' but cannot write to it. Give it Contents: Read and write.'); status(); return; }
        Sync.state = 'ok'; Sync.msg = '';
        await Sync.pullAll();
        status();
        toast(info.private ? 'Connected. Your data repo is private.' : 'Connected. Note: this data repo is public.');
      } catch (err) { Sync.setState('error', errMsg(err)); status(); }
    };
    const disconnect = () => { S.sync = Object.assign({}, S.sync, { token: '' }); ls.set('sync', S.sync); token.value = ''; Sync.refresh(); status(); toast('Disconnected. Nothing was deleted.'); };
    const copyLink = async () => {
      if (!Sync.enabled()) { toast('Connect first, then copy the link.'); return; }
      toast((await copyText(setupLink())) ? 'Setup link copied. Open it on your phone, then delete the message you sent it in.' : 'Copy failed');
    };

    const themeSeg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Theme' },
      [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([v, t]) => h('button', { type: 'button', 'aria-pressed': String(S.ui.theme === v), text: t, onclick: () => { S.ui.theme = v; saveUi(); applyTheme(); renderSettings(); } })));

    const exportData = () => {
      const sols = {};
      ls.keys('sol.').forEach((k) => { sols[k.slice(4)] = ls.get(k, null); });
      const blob = new Blob([JSON.stringify({ exported: new Date().toISOString(), progress: S.progress, custom: S.custom, solutions: sols }, null, 1)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'loop-drills-backup-' + new Date().toISOString().slice(0, 10) + '.json' });
      document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };

    const main = h('main', { class: 'page' }, h('div', { class: 'col' },
      h('header', null,
        h('div', { class: 'eyebrow', text: 'Settings' }),
        h('h1', { class: 'page-title', text: 'Sync and settings' }),
        h('p', { class: 'lede', text: 'Your solutions, progress and added questions are stored as files in a private GitHub repo you own. It is free, keeps full history, and works from your phone too.' })),

      h('form', { class: 'card form', onsubmit: connect, autocomplete: 'off' },
        h('h2', { class: 'section-title', text: 'GitHub sync' }),
        result,
        h('div', { class: 'row2' }, f('Owner', owner), f('Data repo', repo), f('Branch', branch)),
        f('Access token', token, 'Stored only in this browser. Never commit it anywhere.'),
        showTok,
        h('div', { class: 'form-actions' },
          h('button', { class: 'icon-btn primary', type: 'submit' }, 'Save and test'),
          h('button', { class: 'icon-btn', type: 'button', onclick: () => { Sync.pullAll().then(status); } }, 'Sync now'),
          h('button', { class: 'icon-btn', type: 'button', onclick: copyLink }, icon('copy'), 'Copy setup link for your phone'),
          h('button', { class: 'icon-btn', type: 'button', onclick: disconnect }, 'Disconnect')),
        h('div', { class: 'field' },
          h('span', { class: 'lab', text: 'Create the token (one time, about two minutes)' }),
          h('ol', { class: 'steps' },
            h('li', null, 'Open ', h('a', { href: 'https://github.com/settings/personal-access-tokens/new', target: '_blank', rel: 'noopener', text: 'GitHub › Fine-grained tokens › Generate new token' }), '.'),
            h('li', null, 'Name it ', h('code', { text: 'Loop Drills' }), ' and pick an expiration you are comfortable with.'),
            h('li', null, 'Repository access: ', h('b', { text: 'Only select repositories' }), ' › ', h('code', { text: S.sync.repo || 'loop-drills-data' }), '.'),
            h('li', null, 'Permissions › Repository permissions › ', h('b', { text: 'Contents: Read and write' }), '. Leave everything else alone.'),
            h('li', null, 'Generate, copy, paste it above, then press Save and test.'),
            h('li', null, 'On your phone: open this site and paste the same token, or use the setup link button and open that link on the phone.')))),

      h('section', { class: 'card form' },
        h('h2', { class: 'section-title', text: 'Appearance' }),
        h('div', { class: 'field' }, h('span', { class: 'lab', text: 'Theme' }), themeSeg),
        h('div', { class: 'field' }, h('span', { class: 'lab', text: 'Default doc font' }), h('span', { class: 'help', text: 'Change it from the doc toolbar on any question. Arial is the Google Docs default; Courier New is what many candidates switch to for code.' }))),

      h('section', { class: 'card form' },
        h('h2', { class: 'section-title', text: 'Adding questions' }),
        h('p', { class: 'lede', text: 'Use Add in the top bar for your own questions; they are saved to questions/custom.json in your data repo. To have Claude add more, ask it to add questions to Loop Drills: it edits data/bank.json in the loop-drills repo and the site updates within a minute or two.' }),
        h('div', { class: 'form-actions' },
          h('a', { class: 'icon-btn primary', href: '#/add' }, icon('plus'), 'Add a question'),
          h('button', { class: 'icon-btn', type: 'button', onclick: exportData }, icon('download'), 'Download a backup')))));
    mount(main);
    status();
    window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------ router
  const route = { view: null, id: null, ctx: null };
  function readSetupHash() {
    const m = /^#setup=([A-Za-z0-9_-]+)/.exec(location.hash);
    if (!m) return false;
    try {
      const raw = m[1].replace(/-/g, '+').replace(/_/g, '/');
      const p = JSON.parse(atob(raw + '==='.slice((raw.length + 3) % 4)));
      S.sync = { owner: p.o || DEFAULT_SYNC.owner, repo: p.r || DEFAULT_SYNC.repo, branch: p.b || 'main', token: p.t || '' };
      ls.set('sync', S.sync);
      toast('This device is now connected to ' + S.sync.owner + '/' + S.sync.repo);
    } catch (e) { toast('That setup link is broken. Paste the token in Settings instead.'); }
    history.replaceState(null, '', location.pathname + '#/settings');
    return true;
  }
  function onRoute() {
    if (route.ctx && route.ctx.cleanup) route.ctx.cleanup();
    if (route.view === 'home') homeScroll = window.scrollY;
    route.ctx = null;
    if (readSetupHash()) { Sync.pullAll(); }
    const parts = (location.hash || '#/').replace(/^#\/?/, '').split('/').filter(Boolean).map((x) => { try { return decodeURIComponent(x); } catch (e) { return x; } });
    const v = parts[0] || '';
    if (v === 'q' && parts[1]) { route.view = 'q'; route.id = parts[1]; renderQuestion(parts[1], parts[2] === 'blind'); document.title = (qById(parts[1]) || {}).title ? qById(parts[1]).title + ' · Loop Drills' : 'Loop Drills'; return; }
    route.id = null;
    if (v === 'add') { route.view = 'add'; document.title = 'Add a question · Loop Drills'; renderEdit(null); return; }
    if (v === 'edit' && parts[1]) { route.view = 'edit'; document.title = 'Edit question · Loop Drills'; renderEdit(parts[1]); return; }
    if (v === 'settings') { route.view = 'settings'; document.title = 'Settings · Loop Drills'; renderSettings(); return; }
    route.view = 'home'; document.title = 'Loop Drills'; renderHome(false);
    if (Sync.enabled() && Date.now() - Sync.lastPull > 3000) Sync.pullAll();
  }

  // ------------------------------------------------------------------ boot
  async function loadBank() {
    try {
      const r = await fetch('data/bank.json', { cache: 'no-cache' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const b = await r.json();
      ls.set('bankCache', b);
      return b;
    } catch (e) {
      const c = ls.get('bankCache', null);
      if (c) return c;
      throw e;
    }
  }
  async function boot() {
    applyTheme();
    try { S.bank = await loadBank(); } catch (e) {
      $('#app').innerHTML = '';
      $('#app').append(h('div', { class: 'loading', text: 'Could not load the question bank. Check your connection and reload.' }));
      return;
    }
    window.addEventListener('hashchange', onRoute);
    onRoute();
    Sync.refresh();
    if (Sync.enabled()) Sync.pullAll();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        if (route.ctx && route.ctx.editor) route.ctx.editor.flush();
        if (Sync.enabled()) Sync.flushAll();
      } else if (Sync.enabled() && Date.now() - Sync.lastPull > 30000) Sync.pullAll();
    });
    window.addEventListener('online', () => { if (Sync.enabled()) Sync.flushAll(); });
    window.addEventListener('pagehide', () => { if (route.ctx && route.ctx.editor) route.ctx.editor.flush(); });
    setInterval(() => { if (Sync.enabled() && !Sync.inflight && Sync.anyDirty() && Object.keys(Sync.timers).length === 0) Sync.flushAll(); }, 60000);
  }
  boot();
})();
