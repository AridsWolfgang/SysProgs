// SysProgs — unified app shell (vanilla, no build)
const $ = (s) => document.querySelector(s);
const homeEl = $("#view-home"), modEl = $("#view-module"), lessonEl = $("#view-lesson"), progEl = $("#view-progress");
const sideNav = $("#sideNav"), tocEl = $("#toc"), crumbs = $("#crumbs"), q = $("#q");
const overlay = $("#overlay"), sidebar = $("#sidebar"), appShell = $("#app");
let DATA = null, LESSONS = null, current = null;

// ---- persistence ----
const key = "sysprogs-checks";
const getChecks = () => JSON.parse(localStorage.getItem(key) || "{}");
const setChecks = (o) => localStorage.setItem(key, JSON.stringify(o));
const pct = () => {
  const total = DATA ? DATA.modules.length : 16;
  return Math.round((Object.values(getChecks()).filter(Boolean).length / total) * 100);
};
const doneCount = () => Object.values(getChecks()).filter(Boolean).length;

const lessonProgressKey = "sysprogs-lesson-progress";
const getLessonProgress = () => JSON.parse(localStorage.getItem(lessonProgressKey) || "{}");
const setLessonProgress = (o) => localStorage.setItem(lessonProgressKey, JSON.stringify(o));

const collapseKey = "sysprogs-collapse";
const getCollapse = () => JSON.parse(localStorage.getItem(collapseKey) || "{}");
const setCollapse = (o) => localStorage.setItem(collapseKey, JSON.stringify(o));

const themeKey = "sysprogs-theme";
function applyTheme(t) {
  if (t === "light") document.documentElement.setAttribute("data-theme", "light");
  else if (t === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme"); // default dark
}
applyTheme(localStorage.getItem(themeKey) || "");

// ---- helpers ----
function groupByPhase(mods) {
  const g = {};
  mods.forEach((m) => { (g[m.phase] || (g[m.phase] = [])).push(m); });
  return g;
}
function esc(s){ return String(s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function copyText(t) {
  navigator.clipboard.writeText(t).then(()=> toast("Copied")).catch(()=> toast("Copy failed"));
}
window.copyText = copyText;
function toast(msg){
  const host = $("#toast");
  if(!host) return;
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText = "pointer-events:auto;background:var(--card);border:1px solid var(--border);padding:8px 12px;border-radius:999px;box-shadow:var(--shadow-md);font:500 12px var(--font-sans);color:var(--text);margin-top:8px;text-align:center";
  host.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .2s"; }, 900);
  setTimeout(()=> el.remove(), 1200);
}
window.toast = toast;

// ---- sidebar ----
function renderSide(filter=""){
  if(!DATA) return;
  const checks = getChecks(); const collapse = getCollapse(); const f = filter.toLowerCase();
  const groups = groupByPhase(DATA.modules);
  const phaseMeta = {
    "Phase I — The Machine": { sub:"Weeks 1–4 · Foundation", hint:"See the hardware before you write it"},
    "Phase II — Classics": { sub:"Weeks 5–10 · The lingua franca", hint:"C and C++ — the OS tongue"},
    "Phase III — Moderns": { sub:"Weeks 11–14 · Safety & scale", hint:"Rust, Zig, Go — choose your trade"},
    "Phase IV — The System": { sub:"Weeks 15–24 · The machine at work", hint:"Memory, OS, concurrency, I/O, net, sec"},
    "Phase V — Mastery": { sub:"Weeks 25–28 · Ship it", hint:"Toolchains + capstones"},
  };
  let html = "";
  Object.entries(groups).forEach(([phase, mods])=>{
    const visible = mods.filter(m=> !f || (m.id+" "+m.title+" "+m.desc).toLowerCase().includes(f));
    if(!visible.length) return;
    const doneInPhase = visible.filter(m=>checks[m.id]).length;
    const isCollapsed = collapse[phase] && !f;
    const chevron = isCollapsed ? "▸" : "▾";
    const meta = phaseMeta[phase] || { sub:"", hint:""};
    html += `<div class="phase-row" onclick="togglePhase('${esc(phase)}')" title="${esc(meta.hint)}"><span class="chevron">${chevron}</span><div style="flex:1"><div class="phase">${esc(phase)}</div><div style="font:400 10px var(--font-sans);color:var(--faint);letter-spacing:.2px">${esc(meta.sub)}</div></div><span class="count">${doneInPhase}/${visible.length}</span></div>`;
    html += `<div class="phase-mods ${isCollapsed?"hidden":""}">`;
    visible.forEach(m=>{
      const active = current===m.id ? " active" : "";
      const done = checks[m.id] ? " done" : "";
      const subtitle = m.desc || `${m.time||""} ${m.level||""}`.trim();
      html += `<div class="mod${active}${done}" onclick="openModule('${esc(m.id)}')" title="${esc(m.title)} — ${esc(subtitle)}"><span class="dot"></span><div style="flex:1;min-width:0"><div class="t" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(m.title)}</div><div class="d" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(subtitle)}</div></div><span style="margin-left:8px;font-size:11px;color:${checks[m.id]?"var(--success)":"var(--faint)"};flex:none">${checks[m.id]?"✓":"○"}</span></div>`;
    });
    html += `</div>`;
  });
  sideNav.innerHTML = html;
  $("#progBar").style.width = pct()+"%";
  $("#progText").textContent = `${doneCount()} / ${DATA.modules.length} • ${pct()}%`;
}
window.togglePhase = (phase)=>{
  const c = getCollapse(); c[phase]=!c[phase]; setCollapse(c); renderSide(q.value);
};
window.openModule = (id)=>{ location.hash = "#/m/"+id; };

// ---- home (dashboard) ----
function renderHome(filter=""){
  if(!DATA) return;
  const checks = getChecks(); const f = filter.toLowerCase();
  const next = DATA.modules.find(m=> !checks[m.id]);
  const nextId = next ? next.id : DATA.modules[0].id;

  let html = `
  <div class="hero">
    <div class="eyebrow">Systems Programming · 16 modules · 5 phases</div>
    <h1>Learn systems,<br>for real.</h1>
    <p>From a file descriptor to a syscall — no frameworks hiding the truth. Layer by layer until you can build a shell, a KV store, or an HTTP server and explain every byte it touches.</p>
    <div class="row" style="margin-top:14px">
      <a class="btn primary" href="#/m/${nextId}">Continue → ${esc(next ? next.title : "Orientation")}</a>
      <a class="btn" href="#progress">◎ Progress ${doneCount()}/${DATA.modules.length}</a>
      <span class="pill" style="margin-left:4px">${pct()}% complete</span>
    </div>
    <div class="progress" style="max-width:420px;margin-top:14px"><i style="width:${pct()}%"></i></div>
    <div style="margin-top:8px;font:11px var(--font-mono);color:var(--muted)">${doneCount()} / ${DATA.modules.length} modules · search with <span class="kbd">/</span> · theme with ◐</div>
  </div>

  <div class="grid" style="margin-top:14px">
    <div class="card" style="margin:0">
      <h3 style="margin:0 0 6px">How this works</h3>
      <p style="margin:0">Each module is a <strong>course</strong>: why it matters → how it works → runnable code → lab you break → real-world case. Read in order (00→01→02). Each lecture is an interactive page with diagrams you can hover, zoom, and click.</p>
      <div class="row" style="margin-top:10px"><span class="badge">lecture notes</span><span class="badge accent">interactive SVG</span><span class="badge info">code you run</span></div>
    </div>
    <div class="card" style="margin:0">
      <h3 style="margin:0 0 6px">Start here</h3>
      <p style="margin:0">No skipping. Verify toolchain (<code>gcc</code> <code>nasm</code> <code>gdb</code> <code>python</code>), run hello via <code>printf</code> vs <code>write</code>, trace with <code>strace</code>. Your first PR is a playground experiment, not a quiz.</p>
      <div class="row" style="margin-top:10px"><a class="btn small" href="#/m/00-orientation">00 — Orientation →</a><a class="btn small ghost" href="#/l/syscall-boundary">Open lesson: syscall boundary →</a></div>
    </div>
  </div>

  <div style="margin:18px 0 8px;display:flex;justify-content:space-between;align-items:center">
    <h2 style="margin:0;font:700 18px var(--font-sans)">Courses</h2>
    <span style="font:11px var(--font-mono);color:var(--faint)">${filter? "filtered" : "16 modules"} · ${DATA.modules.filter(m=> (m.id+m.title+m.desc).toLowerCase().includes(f)).length} shown</span>
  </div>
  <div class="grid cols-3">`;

  let shown = 0;
  DATA.modules.forEach((m)=>{
    if(f && !(m.id+" "+m.title+" "+m.desc).toLowerCase().includes(f)) return;
    shown++;
    const isDone = checks[m.id];
    const lessons = (LESSONS||[]).filter(l=> l.module_id===m.id);
    html += `<div class="course-card" onclick="openModule('${esc(m.id)}')">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <span style="font:600 11px var(--font-mono);color:var(--faint);letter-spacing:.4px">${esc(m.phase)}</span>
        <span style="font:11px var(--font-mono);color:${isDone?"var(--success)":"var(--faint)"}">${isDone?"✓ done":"○ " + esc(m.time||"")}</span>
      </div>
      <h3>${isDone?"✓ ":""}${esc(m.title)}</h3>
      <p>${esc(m.desc)}</p>
      <div class="row">
        <span class="badge">${esc(m.id)}</span>
        <span class="badge">${esc(m.time||"")}</span>
        <span class="badge ${m.level==="core"?"accent":""}">${esc(m.level||"")}</span>
        ${m.lectures?.length? `<span class="badge info">${m.lectures.length} lectures</span>`:""}
        ${lessons.length? `<span class="badge success">${lessons.length} structured</span>`:""}
      </div>
    </div>`;
  });
  if(!shown) html += `<div class="card" style="grid-column:1/-1">No modules match “${esc(filter)}”. <button class="btn small" onclick="clearSearch()">Clear search</button></div>`;
  html += `</div>`;

  // curated lesson highlight
  if(!f && LESSONS && LESSONS.length){
    html += `<div class="card" style="border-style:dashed"><h3 style="margin:0 0 6px">Featured lesson — structured</h3><p style="margin:0">Typed blocks: prose, callout, diagram, code with copy, resources, quiz, lab — not a markdown dump.</p><div class="row" style="margin-top:10px"><a class="btn small primary" href="#/l/syscall-boundary">Open: From a C library call to a system call →</a><a class="btn small" href="./lesson.html?id=syscall-boundary" target="_blank">Standalone ↗</a></div></div>`;
  }

  homeEl.innerHTML = html;
  crumbs.textContent = "Learn / Overview";
  tocEl.classList.add("hidden"); tocEl.innerHTML = "";
  updateTopNav("home");
}

function clearSearch(){ q.value=""; renderSide(""); renderHome(""); updateSearchMeta(""); q.focus(); }
window.clearSearch = clearSearch;

// ---- module (course overview) ----
function renderModule(id){
  const m = DATA.modules.find(x=>x.id===id); if(!m) return;
  current = id; renderSide(q.value);
  const checks = getChecks();
  const md = m.readme || `# ${m.title}\n\n${m.desc}`;
  // keep markdown but render as secondary detail — not primary UX
  let htmlMd = "";
  try { htmlMd = marked.parse(md); } catch { htmlMd = `<pre>${esc(md.slice(0,4000))}</pre>`; }

  const narratives = {
    "00-orientation":"You’re about to have your first honest conversation with the operating system. Not through a framework — directly, with a file descriptor and a syscall. This is where you learn what ‘systems’ means, set up the tools you’ll keep for 250 hours, and prove you can build something the machine understands.",
    "01-machine-hardware":"Before assembly, see the machine. How a byte sits in memory, why 64 bytes matters, why your laptop and the network disagree on byte order — this module turns hidden facts into pictures you can draw from memory.",
    "02-assembly":"The truth layer. Every language you love — C, Rust, Go — ends here as bytes the CPU decodes. You’ll write it in four voices (x86, x64, ARM, RISC-V) until objdump feels like reading.",
    "03-c":"C is the lingua franca of systems. Kernels, databases, embedded — all speak it. Manage every byte yourself, and tell what the compiler must catch vs what it’s allowed to ignore.",
    "04-cpp":"Same control as C, but the language helps you not leak. A file can close itself and it costs nothing — until C++ starts hiding the machine from you.",
  };
  const intro = narratives[id] || `A focused study on ${esc(m.title.toLowerCase())} — why it matters, how it works, and what you’ll build to prove it.`;

  // structured lessons linked to this module
  const structured = (LESSONS||[]).filter(l=> l.module_id===id);

  let html = `
  <div class="card">
    <div style="font:600 11px var(--font-mono);letter-spacing:.5px;color:var(--faint);text-transform:uppercase">${esc(m.phase)} · ${esc(m.path)}</div>
    <h2 style="margin:6px 0 8px;font:700 24px/1.2 var(--font-sans);letter-spacing:-.3px">${esc(m.title)}</h2>
    <p style="color:var(--muted);font:15px/1.7 var(--font-sans);max-width:65ch">${esc(m.desc)}</p>
    <p style="color:var(--text);font:15px/1.7 var(--font-sans);max-width:65ch;margin-top:8px">${esc(intro)}</p>
    <div class="row" style="margin-top:14px">
      <label class="row" style="gap:8px"><input type="checkbox" class="check" ${checks[id]?"checked":""} onchange="toggleCheck('${esc(id)}',this.checked)"/> Mark course complete</label>
      <span style="flex:1"></span>
      <button class="btn small" onclick="copyText('${esc(m.path)}')">Copy path</button>
      <a class="btn small" href="#home">← Overview</a>
    </div>
    <div class="row" style="margin-top:10px"><span class="badge">${esc(m.id)}</span><span class="badge">${esc(m.time||"")}</span><span class="badge ${m.level==="core"?"accent":""}">${esc(m.level||"")}</span></div>
  </div>`;

  if(structured.length){
    html += `<div class="card"><h3 style="margin:0 0 6px">Structured lessons</h3><p style="margin:0 0 10px;color:var(--muted);font:13px var(--font-sans)">Typed blocks — not markdown. Each lesson renders prose, diagrams, code, quiz, lab with a11y + fallbacks.</p><div style="display:grid;gap:8px">${structured.map(l=>`
      <a href="#/l/${esc(l.id)}" style="display:block;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--raised);text-decoration:none">
        <div style="font:600 13px var(--font-sans);color:var(--text)">${esc(l.title)}</div>
        <div style="font:12px var(--font-sans);color:var(--muted);margin-top:2px">${esc(l.estimated_minutes)} min · ${esc(l.difficulty)} · ${esc(l.learning_objectives.length)} objectives</div>
        <div style="font:12px var(--font-sans);color:var(--faint);margin-top:4px">${esc(l.summary||"")}</div>
      </a>`).join("")}</div></div>`;
  }

  if(m.lectures && m.lectures.length){
    html += `<div class="card"><h3 style="margin:0 0 6px">Lecture notes — deep dives</h3><p style="color:var(--muted);font:13px var(--font-sans);margin:0">Subcategories as textbook pages: extensive, interactive SVGs. Click to read.</p><div style="display:grid;gap:8px;margin-top:10px">`+
      m.lectures.map(l=>`<a href="#/m/${esc(m.id)}/${esc(l.id)}" style="display:block;padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--raised);text-decoration:none"><div style="font:600 13px var(--font-sans);color:var(--text)">${esc(l.title)}</div><div style="font:12px var(--font-sans);color:var(--muted);margin-top:2px">${esc(l.id)} · lecture note · interactive SVG</div></a>`).join("")+
      `</div></div>`;
  }

  html += `<div class="card content" id="mdContent">${htmlMd}</div>`;

  if(m.examples && m.examples.length){
    html += `<div class="card"><h3>Runnable examples</h3><p style="color:var(--muted);font:13px var(--font-sans)">Each file header has PURPOSE + BUILD. Copy and run.</p>${m.examples.map(e=>`
      <div style="border:1px solid var(--border);border-radius:12px;padding:12px;margin:10px 0;background:var(--raised)">
        <div style="font:600 13px var(--font-mono);color:var(--text)">${esc(e.file)}</div>
        <div style="font:12px var(--font-sans);color:var(--muted);margin-top:2px">${esc(e.purpose||"")}</div>
        ${e.build?`<pre style="margin-top:8px;position:relative"><code class="language-bash">${esc(e.build)}</code><button class="copy" onclick="copyText(\`${esc(e.build).replace(/`/g,"\\`")}\`)" style="position:absolute;top:8px;right:8px">copy</button></pre>`:""}
      </div>`).join("")}</div>`;
  }

  // TOC
  modEl.innerHTML = html;
  if(window.Prism) Prism.highlightAllUnder(modEl);
  crumbs.innerHTML = `<a href="#home">Learn</a> / <a href="#/m/${m.id}">${esc(m.title)}</a>`;
  enhanceCodeBlocks(modEl);
  buildTOC("#mdContent");
  showTab("module");
  if(isMobile()) closeDrawer();
  updateTopNav("home");
  // trigger interactive SVG scan
  setTimeout(()=> document.dispatchEvent(new Event("interactive-scan")), 100);
}

function enhanceCodeBlocks(root){
  const scope = root.querySelector("#mdContent") || root;
  scope.querySelectorAll("pre").forEach(pre=>{
    if(pre.querySelector(".copy")) return;
    const code = pre.querySelector("code");
    const lang = code && code.className.match(/language-(\w+)/)?.[1] || "";
    if(lang && !pre.querySelector(".code-head")){
      const hdr = document.createElement("div");
      hdr.className = "code-head";
      hdr.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:-14px -14px 10px;padding:7px 10px;background:rgba(255,255,255,.04);border-bottom:1px solid var(--border);border-radius:10px 10px 0 0;font:600 11px var(--font-mono);color:var(--muted);letter-spacing:.3px";
      hdr.innerHTML = `<span>${esc(lang)}</span><span style="opacity:.6">SysProgs</span>`;
      pre.style.paddingTop = "0"; pre.prepend(hdr);
    }
    const b = document.createElement("button");
    b.textContent = "copy"; b.className = "copy";
    b.style.top = lang ? "42px" : "8px";
    b.onclick = ()=> copyText(code ? code.innerText : pre.innerText);
    pre.style.position = "relative"; pre.appendChild(b);
  });
}

function buildTOC(contentSelector){
  const contentEl = document.querySelector(contentSelector);
  if(!contentEl) { tocEl.classList.add("hidden"); return; }
  const headings = contentEl.querySelectorAll("h2,h3");
  headings.forEach(h=>{ if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-"); });
  if(!headings.length){ tocEl.classList.add("hidden"); tocEl.innerHTML=""; return; }
  tocEl.classList.remove("hidden");
  tocEl.innerHTML = `<h4>On this page</h4>` + Array.from(headings).map(h=>`<a href="#${h.id}" data-h="${h.id}" style="padding-left:${h.tagName==="H3"?"12px":"0"}">${esc(h.textContent)}</a>`).join("");
  const links = tocEl.querySelectorAll("a");
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ links.forEach(a=> a.classList.toggle("active", a.dataset.h===e.target.id)); }
    });
  }, { rootMargin:"-20% 0px -70% 0px", threshold:0 });
  headings.forEach(h=> obs.observe(h));
  links.forEach(a=> a.addEventListener("click", e=>{
    e.preventDefault(); document.getElementById(a.dataset.h).scrollIntoView({behavior:"smooth", block:"start"}); history.replaceState(null,"","#"+a.dataset.h);
  }));
}

// ---- structured lesson renderer (inline, mirrors lesson-renderer.js but inside SPA) ----
function renderLessonInline(lessonId){
  const lesson = (LESSONS||[]).find(l=> l.id===lessonId);
  if(!lesson){
    lessonEl.innerHTML = `<div class="card"><h2>Lesson not found</h2><p style="color:var(--muted)">No structured lesson with id “${esc(lessonId)}”. Open <a href="#home">Learn</a> or try <a href="./lesson.html?id=${esc(lessonId)}">standalone</a>.</p></div>`;
    showTab("lesson"); crumbs.textContent = "Lesson / Not found"; tocEl.classList.add("hidden"); return;
  }
  current = lesson.module_id;
  renderSide(q.value);

  // build blocks using safe DOM (reuse logic from lesson-renderer)
  const frag = document.createDocumentFragment();
  const header = document.createElement("div");
  header.className = "card";
  header.innerHTML = `
    <div style="font:700 11px var(--font-mono);letter-spacing:.5px;color:var(--faint);text-transform:uppercase">${esc(lesson.module_id.replaceAll("-"," "))} · ${esc(lesson.difficulty)} · ${lesson.estimated_minutes} min</div>
    <h2 style="margin:6px 0 8px;font:700 28px/1.15 var(--font-sans);letter-spacing:-.4px">${esc(lesson.title)}</h2>
    ${lesson.subtitle? `<p style="color:var(--muted);font:15px/1.7 var(--font-sans);max-width:65ch">${esc(lesson.subtitle)}</p>`:""}
    <div class="row" style="margin-top:10px"><span class="badge">${esc(lesson.difficulty)}</span><span class="badge">${lesson.estimated_minutes} min</span><span class="badge info">${lesson.learning_objectives.length} objectives</span></div>
    <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><a class="btn small" href="#/m/${esc(lesson.module_id)}">← Back to ${esc(lesson.module_id)}</a><a class="btn small ghost" href="./lesson.html?id=${esc(lesson.id)}" target="_blank">Open standalone ↗</a></div>
  `;
  frag.appendChild(header);

  const outcomes = document.createElement("div"); outcomes.className = "card";
  outcomes.innerHTML = `<h3 style="margin:0 0 8px">What you'll learn</h3><ul style="margin:0;padding-left:18px;color:var(--muted)">${lesson.learning_objectives.map(o=>`<li style="margin:6px 0">${esc(o)}</li>`).join("")}</ul>`;
  frag.appendChild(outcomes);

  // render typed blocks
  const blockHost = document.createElement("div");
  lesson.blocks.forEach(b=> blockHost.appendChild(renderBlock(b)));
  frag.appendChild(blockHost);

  // progress + nav
  const nav = document.createElement("div"); nav.className = "card lesson-navigation";
  const lessonProg = getLessonProgress();
  const isDone = !!lessonProg[lesson.id];
  nav.innerHTML = `
    <label class="row" style="gap:8px"><input type="checkbox" ${isDone?"checked":""} id="lessonDoneChk"/> Mark lesson complete</label>
    <span style="flex:1"></span>
    <a href="#home">← Catalogue</a>
    ${lesson.next_lesson_id? `<a href="#/l/${esc(lesson.next_lesson_id)}">Next: ${esc(lesson.next_lesson_id)} →</a>`:""}
  `;
  frag.appendChild(nav);

  lessonEl.replaceChildren(frag);
  // hydrate code + prism
  if(window.Prism) Prism.highlightAllUnder(lessonEl);
  enhanceLessonCodeBlocks(lessonEl);
  // TOC for lesson
  lessonEl.querySelectorAll(".lesson-heading").forEach(h=>{
    if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-");
  });
  const hs = lessonEl.querySelectorAll(".lesson-heading");
  if(hs.length){
    tocEl.classList.remove("hidden");
    tocEl.innerHTML = `<h4>On this page</h4>` + Array.from(hs).map(h=>`<a href="#${h.id}" data-h="${h.id}">${esc(h.textContent)}</a>`).join("");
    const links = tocEl.querySelectorAll("a");
    const obs = new IntersectionObserver(es=> es.forEach(e=>{ if(e.isIntersecting) links.forEach(a=>a.classList.toggle("active", a.dataset.h===e.target.id)); }), {rootMargin:"-20% 0px -70% 0px", threshold:0});
    hs.forEach(h=>obs.observe(h));
    links.forEach(a=> a.addEventListener("click", e=>{ e.preventDefault(); document.getElementById(a.dataset.h).scrollIntoView({behavior:"smooth"}); }));
  } else tocEl.classList.add("hidden");

  showTab("lesson");
  crumbs.innerHTML = `<a href="#home">Learn</a> / <a href="#/m/${lesson.module_id}">${esc(lesson.module_id)}</a> / ${esc(lesson.title)}`;
  if(isMobile()) closeDrawer();
  updateTopNav("home");

  // lesson completion toggle
  const chk = document.getElementById("lessonDoneChk");
  if(chk) chk.addEventListener("change", e=>{
    const p = getLessonProgress(); p[lesson.id]= e.target.checked; setLessonProgress(p);
    toast(e.target.checked ? "Lesson marked complete" : "Lesson marked incomplete");
  });

  setTimeout(()=> document.dispatchEvent(new Event("interactive-scan")), 100);

  // bind quiz/lab already done in renderBlock
}

function enhanceLessonCodeBlocks(root){
  root.querySelectorAll(".lesson-code pre").forEach(pre=>{
    const b = pre.querySelector(".copy-code");
    // already has copy via block renderer — ensure prism
  });
}

// ---- block renderer (safe, mirrors lesson-renderer.js) ----
function renderBlock(item){
  const block = (tag, cls, text)=>{ const el=document.createElement(tag); if(cls) el.className=cls; if(text!==undefined) el.textContent=text; return el; };
  const inlineMd = (value)=>{
    const s = String(value??"").replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    return s.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  };
  const paraMd = (value)=> String(value??"").trim().split(/\n\s*\n/).map(p=>{
    const lines = p.split("\n");
    if(lines.every(l=> /^\s*[-*]\s+/.test(l))) return "<ul>"+lines.map(l=> "<li>"+inlineMd(l.replace(/^\s*[-*]\s+/, ""))+"</li>").join("")+"</ul>";
    return "<p>"+lines.map(inlineMd).join("<br>")+"</p>";
  }).join("");

  switch(item.type){
    case "heading": return block("h"+item.level, "lesson-heading", item.text);
    case "prose": { const el=block("div","lesson-prose"); el.innerHTML = paraMd(item.markdown); return el; }
    case "callout": { const el=block("section","lesson-callout tone-"+item.tone); el.append(block("strong","",item.title)); const body=block("div",""); body.innerHTML = paraMd(item.markdown); el.append(body); return el; }
    case "image": { const fig=block("figure","lesson-figure"); const img=document.createElement("img"); img.src=item.src; img.alt=item.alt; img.loading="lazy"; img.addEventListener("error",()=>{ img.hidden=true; fig.append(block("p","muted","Diagram unavailable. "+item.alt)); }); fig.append(img, block("figcaption","",item.caption)); if(item.attribution) fig.append(block("small","media-credit","Source: "+item.attribution)); return fig; }
    case "video": { const sec=block("section","lesson-video"); sec.append(block("h3","",item.title), block("p","muted", item.creator + (item.duration?" · "+item.duration:""))); const fr=document.createElement("iframe"); fr.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(item.video_id)+(item.start_seconds?"?start="+item.start_seconds:""); fr.title=item.title; fr.loading="lazy"; fr.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; fr.allowFullscreen=true; sec.append(fr); if(item.why_watch) sec.append(block("p","",item.why_watch)); const a=document.createElement("a"); a.href=item.fallback_url; a.target="_blank"; a.rel="noopener noreferrer"; a.textContent="Watch on YouTube ↗"; sec.append(a); return sec; }
    case "code": {
      const sec=block("section","lesson-code"); const head=block("div","code-head", (item.filename||"Code example")+" · "+item.language);
      const btn=block("button","copy-code","Copy"); btn.type="button"; btn.addEventListener("click", ()=> navigator.clipboard?.writeText(item.source).then(()=>{ btn.textContent="Copied"; setTimeout(()=>btn.textContent="Copy",1200); }));
      head.append(btn); const pre=document.createElement("pre"); const code=document.createElement("code"); code.className="language-"+item.language; code.textContent=item.source; pre.append(code); sec.append(head,pre);
      if(item.explanation) sec.append(block("p","muted", item.explanation));
      if(item.build_command) sec.append(block("p","build-command","Build: "+item.build_command));
      if(item.expected_output){ const d=document.createElement("details"); d.append(block("summary","","Expected output")); const pr=block("pre","expected-output", item.expected_output); d.append(pr); sec.append(d); }
      return sec;
    }
    case "resource": { const a=document.createElement("a"); a.className="lesson-resource card"; a.href=item.url; a.target="_blank"; a.rel="noopener noreferrer"; a.style.textDecoration="none"; const t=block("strong","",item.title); const meta=block("small","", item.publisher+" · "+(item.kind||"resource")); const pur=block("span","muted", item.purpose); a.append(t,meta,pur); return a; }
    case "quiz": {
      const sec=block("section","lesson-quiz"); sec.append(block("h3","",item.question));
      const fb=block("p","quiz-feedback","Choose an answer to see feedback.");
      item.options.forEach((opt,i)=>{
        const b=block("button","quiz-option", opt); b.type="button";
        b.addEventListener("click", ()=>{
          sec.querySelectorAll("button").forEach(x=> x.disabled=true);
          b.classList.add(i===item.correct_option ? "correct":"incorrect");
          fb.textContent = (i===item.correct_option ? "Correct. " : "Not quite. ") + item.explanation;
        });
        sec.append(b);
      });
      sec.append(fb); return sec;
    }
    case "lab": {
      const sec=block("section","lesson-lab"); sec.append(block("h3","",item.title), block("p","",item.objective));
      if(item.environment) sec.append(block("p","muted","Environment: "+item.environment));
      const ol=document.createElement("ol"); (item.instructions||[]).forEach(s=> ol.append(block("li","",s))); sec.append(ol);
      if(item.hints?.length){ const d=document.createElement("details"); d.append(block("summary","","Show hints")); const ul=document.createElement("ul"); item.hints.forEach(h=> ul.append(block("li","",h))); d.append(ul); sec.append(d); }
      const crit=document.createElement("div"); crit.append(block("strong","","Completion checklist"));
      (item.completion_criteria||[]).forEach(t=>{
        const lab=block("label","lab-check"); const inp=document.createElement("input"); inp.type="checkbox"; lab.append(inp, document.createTextNode(" "+t)); crit.append(lab);
      });
      sec.append(crit); return sec;
    }
    default: return block("p","muted","Unsupported block: "+item.type);
  }
}

// ---- lecture ----
function renderLecture(mid, lid){
  const m = DATA.modules.find(x=>x.id===mid); if(!m) return;
  const l = (m.lectures||[]).find(x=>x.id===lid); if(!l) return;
  current = mid; renderSide(q.value);
  let htmlMd = "";
  try{ htmlMd = marked.parse(l.content||`# ${l.title}\n\nLecture note.`); } catch{ htmlMd = `<p>${esc(l.content||"")}</p>`; }
  let html = `<div class="card"><div style="font:600 11px var(--font-mono);color:var(--faint)">LECTURE · ${esc(m.phase)} · ${esc(mid)}</div><h2 style="margin:6px 0 8px;font:700 22px/1.2 var(--font-sans)">${esc(l.title)}</h2><div class="row"><a class="btn small" href="#/m/${esc(mid)}">← Back to ${esc(m.title)}</a><span class="badge">${esc(lid)}</span></div></div>`;
  html += `<div class="card content" id="mdContent">${htmlMd}</div>`;
  modEl.innerHTML = html;
  if(window.Prism) Prism.highlightAllUnder(modEl);
  crumbs.innerHTML = `<a href="#home">Learn</a> / <a href="#/m/${esc(mid)}">${esc(m.title)}</a> / ${esc(l.title)}`;
  enhanceCodeBlocks(modEl);
  buildTOC("#mdContent");
  showTab("module");
  if(isMobile()) closeDrawer();
  updateTopNav("home");
  setTimeout(()=> document.dispatchEvent(new Event("interactive-scan")), 100);
}

// ---- progress ----
function renderProgress(){
  const checks = getChecks();
  const lessonProg = getLessonProgress();
  const doneLessons = Object.values(lessonProg).filter(Boolean).length;
  const totalLessons = (LESSONS||[]).length;
  let html = `<div class="card"><h3 style="margin:0 0 8px">Your progress</h3><div class="progress"><i style="width:${pct()}%"></i></div><p style="margin:8px 0 0;color:var(--muted)">${doneCount()} / ${DATA.modules.length} courses · ${pct()}% · ${doneLessons}/${totalLessons} structured lessons</p><div class="row" style="margin-top:10px"><button class="btn small" onclick="if(confirm('Reset all progress?')){localStorage.removeItem('${key}');localStorage.removeItem('${lessonProgressKey}');renderSide();renderHome(q.value);renderProgress(); toast('Progress reset')}">Reset progress</button><a class="btn small ghost" href="#home">← Continue learning</a></div></div>`;
  html += `<div class="card"><h3 style="margin:0 0 8px">Courses</h3>${DATA.modules.map(m=>`<label class="row" style="padding:8px 0;border-bottom:1px solid var(--border)"><input type="checkbox" class="check" ${checks[m.id]?"checked":""} onchange="toggleCheck('${esc(m.id)}',this.checked)"/> <span style="font:500 13px var(--font-sans)">${esc(m.id)} — ${esc(m.title)}</span> <span style="margin-left:auto;color:var(--muted);font:12px var(--font-mono)">${esc(m.time||"")}</span></label>`).join("")}</div>`;
  if(totalLessons){
    html += `<div class="card"><h3 style="margin:0 0 8px">Structured lessons</h3>${(LESSONS||[]).map(l=>`<label class="row" style="padding:8px 0;border-bottom:1px solid var(--border)"><input type="checkbox" class="check" ${lessonProg[l.id]?"checked":""} onchange="(function(v){const p=JSON.parse(localStorage.getItem('${lessonProgressKey}')||'{}');p['${esc(l.id)}']=v;localStorage.setItem('${lessonProgressKey}',JSON.stringify(p));renderProgress()})(this.checked)"/> <span style="font:500 13px var(--font-sans)">${esc(l.title)}</span> <span style="margin-left:auto;color:var(--muted);font:11px var(--font-mono)">${esc(l.id)}</span></label>`).join("")}</div>`;
  }
  progEl.innerHTML = html;
  crumbs.textContent = "Progress";
  tocEl.classList.add("hidden");
  showTab("progress");
  updateTopNav("progress");
}
window.toggleCheck = (id, v)=>{
  const c = getChecks(); c[id]=v; setChecks(c);
  renderSide(q.value); renderHome(q.value); renderProgress();
  if(current) {
    // re-render current module if open
    const m = DATA.modules.find(x=>x.id===current);
    if(m) renderModule(current);
  }
};

// ---- tab / drawer / routing ----
function isMobile(){ return window.innerWidth <= 900; }
function showTab(t){
  homeEl.classList.toggle("hidden", t!=="home");
  modEl.classList.toggle("hidden", t!=="module");
  lessonEl.classList.toggle("hidden", t!=="lesson");
  progEl.classList.toggle("hidden", t!=="progress");
  document.querySelectorAll(".nav.mobile-only button").forEach(b=> b.classList.toggle("active", b.dataset.tab=== (t==="lesson"?"module":t)));
  if(t==="home"){ tocEl.classList.add("hidden"); crumbs.textContent="Learn / Overview"; }
}
function updateTopNav(active){
  document.querySelectorAll(".topnav a[data-nav]").forEach(a=> a.classList.toggle("active", a.dataset.nav===active));
}
function openDrawer(){
  if(isMobile()){ sidebar.classList.add("open"); overlay.classList.remove("hidden"); }
  else { appShell.classList.remove("sidebar-collapsed"); sidebar.classList.add("open"); overlay.classList.add("hidden"); }
}
function closeDrawer(){
  if(isMobile()){ sidebar.classList.remove("open"); overlay.classList.add("hidden"); }
  else { appShell.classList.add("sidebar-collapsed"); }
}
function toggleDrawer(){
  if(isMobile()){ sidebar.classList.contains("open") ? closeDrawer() : openDrawer(); }
  else { appShell.classList.contains("sidebar-collapsed") ? openDrawer() : closeDrawer(); }
}
$("#openSide").onclick = toggleDrawer;
$("#closeSide").onclick = closeDrawer;
overlay.onclick = closeDrawer;
window.addEventListener("resize", ()=>{
  if(!isMobile()) overlay.classList.add("hidden");
});
document.querySelectorAll(".nav.mobile-only button[data-tab]").forEach(b=> b.addEventListener("click", ()=>{
  location.hash = b.dataset.tab==="home" ? "#home" : "#"+b.dataset.tab;
  closeDrawer();
}));
window.addEventListener("hashchange", handleHash);

function handleHash(){
  const h = location.hash || "#home";
  // order: lesson, lecture, module, progress, home
  if(h.startsWith("#/l/") || h.startsWith("#/lesson/")){
    const id = h.split("/").pop();
    renderLessonInline(id);
    return;
  }
  if(h.startsWith("#/m/")){
    const parts = h.slice(4).split("/");
    if(parts.length===2) renderLecture(parts[0], parts[1]);
    else renderModule(parts[0]);
    return;
  }
  if(h==="#progress"){ renderProgress(); return; }
  if(h==="#module" && current){ renderModule(current); return; }
  // default home
  renderHome(q ? q.value : "");
  showTab("home");
}

// ---- search ----
const clearQ = $("#clearQ"), searchMeta = $("#searchMeta");
function updateSearchMeta(filter){
  if(!DATA) return;
  const f = filter.toLowerCase();
  const count = f ? DATA.modules.filter(m=> (m.id+" "+m.title+" "+m.desc).toLowerCase().includes(f)).length : DATA.modules.length;
  searchMeta.textContent = f ? `${count} result${count!==1?"s":""} for “${filter}”` : "";
  clearQ.classList.toggle("hidden", !f);
}
if(q){
  q.addEventListener("input", ()=>{ renderSide(q.value); renderHome(q.value); updateSearchMeta(q.value); });
  if(clearQ) clearQ.onclick = ()=>{ q.value=""; renderSide(""); renderHome(""); updateSearchMeta(""); q.focus(); };
  document.addEventListener("keydown", e=>{
    if(e.key==="/" && document.activeElement!==q){ e.preventDefault(); q.focus(); }
    if(e.key==="Escape" && q.value){ q.value=""; renderSide(""); renderHome(""); updateSearchMeta(""); }
  });
}

// ---- install + theme ----
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); deferredPrompt=e; const b=$("#installBtn"); if(b) b.style.display="inline-flex"; });
$("#installBtn")?.addEventListener("click", async()=>{
  if(deferredPrompt){ deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt=null; $("#installBtn").style.display="none"; }
});
$("#themeBtn").onclick = ()=>{
  const cur = document.documentElement.getAttribute("data-theme");
  // toggle: dark (default, no attr) <-> light, dark attr treated as dark
  let next = "";
  if(!cur || cur==="dark") next = "light";
  else next = "dark";
  // actually dark default = no attr, but we persist explicit
  if(next==="light"){ document.documentElement.setAttribute("data-theme","light"); localStorage.setItem(themeKey,"light"); }
  else { document.documentElement.removeAttribute("data-theme"); localStorage.setItem(themeKey,""); }
  toast(next==="light" ? "Light theme" : "Dark theme");
};

// ---- load ----
async function load(){
  const [modRes, lessonRes] = await Promise.all([
    fetch("./data/modules.json"),
    fetch("./data/lessons.json").catch(()=> null)
  ]);
  DATA = await modRes.json();
  try{
    if(lessonRes && lessonRes.ok){ const lj = await lessonRes.json(); LESSONS = lj.lessons || []; }
    else LESSONS = [];
  } catch { LESSONS = []; }

  // init sidebar state
  if(!isMobile()){ appShell.classList.remove("sidebar-collapsed"); sidebar.classList.add("open"); }
  else sidebar.classList.remove("open");

  renderSide(); renderHome(); renderProgress(); updateSearchMeta(""); handleHash();
}
load().catch(e=>{
  homeEl.innerHTML = `<div class="card"><h3>Failed to load</h3><p style="color:var(--muted)">Run via a local server: <code>python -m http.server 8000 --directory web</code><br>Error: ${esc(e.message||e)}</p><button class="btn small" onclick="location.reload()">Retry</button></div>`;
});
