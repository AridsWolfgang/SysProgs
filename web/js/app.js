// Docs-style — sidebar tree + TOC, vanilla
const $=s=>document.querySelector(s);
const homeEl=$('#view-home'), modEl=$('#view-module'), progEl=$('#view-progress');
const sideNav=$('#sideNav'), tocEl=$('#toc'), crumbs=$('#crumbs'), q=$('#q');
const overlay=$('#overlay'), sidebar=$('#sidebar');
let DATA=null, current=null;
const key='sysprogs-checks';
const getChecks=()=>JSON.parse(localStorage.getItem(key)||'{}');
const setChecks=o=>localStorage.setItem(key, JSON.stringify(o));
const pct=()=> Math.round(Object.values(getChecks()).filter(Boolean).length / (DATA?DATA.modules.length:16) *100);
const doneCount=()=> Object.values(getChecks()).filter(Boolean).length;
function groupByPhase(mods){ const g={}; mods.forEach(m=>{ (g[m.phase]||(g[m.phase]=[])).push(m); }); return g; }
const collapseKey='sysprogs-collapse';
const getCollapse=()=>JSON.parse(localStorage.getItem(collapseKey)||'{}');
const setCollapse=o=>localStorage.setItem(collapseKey, JSON.stringify(o));
function renderSide(filter=""){
  const checks=getChecks(); const collapse=getCollapse(); const f=filter.toLowerCase(); const groups=groupByPhase(DATA.modules); let html='';
  const phaseMeta={
    "Phase I — The Machine":{sub:"Weeks 1–4 · Foundation", hint:"See the hardware before you write it"},
    "Phase II — Classics":{sub:"Weeks 5–10 · The lingua franca", hint:"C and C++ — the OS tongue"},
    "Phase III — Moderns":{sub:"Weeks 11–14 · Safety & scale", hint:"Rust, Zig, Go — choose your trade"},
    "Phase IV — The System":{sub:"Weeks 15–24 · The machine at work", hint:"Memory, OS, concurrency, I/O, net, sec"},
    "Phase V — Mastery":{sub:"Weeks 25–28 · Ship it", hint:"Toolchains + capstones"}
  };
  Object.entries(groups).forEach(([phase, mods])=>{
    const visible = mods.filter(m=> !f || (m.id+m.title+m.desc).toLowerCase().includes(f)); if(!visible.length) return;
    const doneInPhase = visible.filter(m=>checks[m.id]).length; const isCollapsed = collapse[phase] && !f; const chevron = isCollapsed ? '▸' : '▾';
    const meta = phaseMeta[phase] || {sub:"", hint:""};
    html+=`<div class="phase-row" onclick="togglePhase('${phase}')" title="${meta.hint}"><span class="chevron">${chevron}</span><div style="flex:1"><div class="phase">${phase}</div><div style="font:400 10px var(--font-sans);color:var(--faint);letter-spacing:.2px">${meta.sub}</div></div><span class="count">${doneInPhase}/${visible.length}</span></div>`;
    html+=`<div class="phase-mods ${isCollapsed?'hidden':''}">`;
    visible.forEach(m=>{
      const active = current===m.id ? ' active' : '';
      const done = checks[m.id] ? ' done' : '';
      // Use desc as narrative subtitle, not time•level
      const subtitle = m.desc || `${m.time||''} ${m.level||''}`.trim();
      html+=`<div class="mod${active}${done}" onclick="openModule('${m.id}')" title="${m.title} — ${subtitle}"><span class="dot"></span><div style="flex:1;min-width:0"><div class="t" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.title}</div><div class="d" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${subtitle}</div></div><span style="margin-left:8px;font-size:11px;color:${checks[m.id]?'var(--accent)':'var(--faint)'};flex:none">${checks[m.id]?'✓':'○'}</span></div>`;
    });
    html+=`</div>`;
  });
  sideNav.innerHTML=html; $('#progBar').style.width=pct()+'%'; $('#progText').textContent=`${doneCount()} / ${DATA.modules.length} • ${pct()}%`;
}
window.togglePhase=phase=>{ const c=getCollapse(); c[phase]=!c[phase]; setCollapse(c); renderSide(q.value); };
function renderHome(filter=""){
  const checks=getChecks(); const f=filter.toLowerCase();
  let html=`<div class="card" style="padding:28px 20px;background:var(--bg);border:1px solid var(--border);">
    <div style="font:600 11px var(--font-mono);letter-spacing:.6px;color:var(--faint);text-transform:uppercase">A complete journey — from silicon to services</div>
    <h1 style="margin:8px 0 10px;font:700 36px/1.05 var(--font-sans);letter-spacing:-0.8px">Learn systems, for real.</h1>
    <p style="color:var(--muted);max-width:65ch;font:15px/1.7 var(--font-sans)">You’ll start by talking directly to the operating system — no frameworks hiding the truth — and climb, layer by layer, until you can build a shell, a key-value store, or an HTTP server and explain every byte it touches. 16 modules, carefully ordered. Each one: why it matters, how it works, code you run, a lab you break, and a real-world case.</p>
    <p style="color:var(--muted);max-width:65ch;font:13px/1.6 var(--font-sans)">We use paper and ink on screen, code that compiles, and diagrams you can read — no video fluff, no markdown dump. Just you, the machine, and the next curiosity in <code>playground/</code>.</p>
    <div style="margin:14px 0;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
      <code style="font:12px var(--font-mono);background:var(--surface);border:1px solid var(--border);padding:9px 12px;border-radius:10px">python -m http.server 8000 --directory web</code>
      <button class="btn small primary" onclick="copyText('python -m http.server 8000 --directory web')">Copy install</button>
      <a class="btn small" href="#progress">◎ Progress ${doneCount()}/${DATA.modules.length}</a>
    </div>
    <div class="progress" style="max-width:420px"><i style="width:${pct()}%"></i></div><small style="color:var(--muted);font:11px var(--font-mono)">${doneCount()} / ${DATA.modules.length} done — search with /</small></div><div class="grid">`;
  DATA.modules.forEach((m,i)=>{
    if(f && !(m.id+m.title+m.desc).toLowerCase().includes(f)) return;
    html+=`<div class="module" onclick="openModule('${m.id}')" style="position:relative"><div style="font:500 11px var(--font-sans);color:var(--faint);letter-spacing:.4px">${m.phase}</div><h3 style="margin:6px 0 6px">${checks[m.id]?'✓ ':''}${m.title}</h3><div style="font-size:13px;color:var(--muted)">${m.desc}</div><div class="row" style="margin-top:10px"><span class="badge">${m.id}</span><span class="badge">${m.time||''}</span><span class="badge">${m.level||''}</span></div></div>`;
  });
  html+='</div>'; homeEl.innerHTML=html; crumbs.textContent='Learn / Overview'; tocEl.classList.add('hidden'); tocEl.innerHTML='';
}
function renderModule(id){
  const m=DATA.modules.find(x=>x.id===id); if(!m) return; current=id; renderSide(q.value); const checks=getChecks(); const md=m.readme||`# ${m.title}\n\n${m.desc}`; const htmlMd = marked.parse(md);
  // Narrative intro — well written, not markdown dump
  const narratives={
    "00-orientation":"You’re about to have your first honest conversation with the operating system. Not through a framework — directly, with a file descriptor and a syscall. This is where you learn what ‘systems’ actually means, set up the tools you’ll keep for 250 hours, and prove to yourself that you can build and run something the machine understands.",
    "01-machine-hardware":"Before you write a line of assembly, you need to see the machine. How a byte sits in memory, why 64 bytes matters, why your laptop and the network disagree on order — this module turns those hidden facts into pictures you can draw from memory.",
    "02-assembly":"This is the truth layer. Every language you love — C, Rust, Go — ends here, as bytes the CPU decodes. You’ll write it in four voices (x86, x64, ARM, RISC-V) until `objdump -d` feels like reading.",
    "03-c":"C is the lingua franca of systems. Kernels, databases, embedded — all speak it. Here you learn to manage every byte yourself, and to tell the difference between a bug the compiler must catch and one it’s allowed to ignore.",
    "04-cpp":"Same control as C, but the language helps you not leak. You’ll see why a file can close itself and why that costs nothing — and when C++ starts hiding the machine from you."
  };
  const intro = narratives[id] || `A focused study on ${m.title.toLowerCase()} — why it matters, how it works, and what you’ll build to prove it.`;
  let html=`<div class="card"><div style="font:600 11px var(--font-mono);letter-spacing:.5px;color:var(--faint);text-transform:uppercase">${m.phase} • ${m.path}</div><h2 style="margin:6px 0 8px;font:700 22px/1.2 var(--font-sans);letter-spacing:-.3px">${m.title}</h2><p style="color:var(--muted);font:15px/1.7 var(--font-sans);max-width:65ch">${m.desc}</p><p style="color:var(--text);font:15px/1.7 var(--font-sans);max-width:65ch;margin-top:8px">${intro}</p><label class="row" style="margin-top:14px"><input type="checkbox" class="check" ${checks[id]?'checked':''} onchange="toggleCheck('${id}',this.checked)"/> Mark as done</label><div class="row" style="margin-top:10px"><button class="btn small" onclick="copyText('${m.path}')">Copy path</button><button class="btn small" onclick="location.hash='#home'">← Overview</button></div></div>`;
  // Lectures (subcategories) — lecture-note style
  if(m.lectures && m.lectures.length){
    html+=`<div class="card"><h3 style="margin:0 0 8px">Lectures — deep dives</h3><p style="color:var(--muted);font:13px var(--font-sans)">Subcategories as lecture notes: extensive, interactive SVGs, crazy detail. Click to read like a textbook.</p><div style="display:grid;gap:8px;margin-top:10px">`+
      m.lectures.map(l=>`<a href="#/m/${m.id}/${l.id}" style="display:block;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--surface);text-decoration:none"><div style="font:600 13px var(--font-sans);color:var(--text)">${l.title}</div><div style="font:12px var(--font-sans);color:var(--muted);margin-top:2px">${l.id} • lecture note • interactive SVG</div></a>`).join('')+
      `</div></div>`;
  }
  html+=`<div class="card content" id="mdContent">${htmlMd}</div>`;
  if(m.examples && m.examples.length){ html+=`<div class="card"><h3>Examples</h3>${m.examples.map(e=>`<div style="border:1px solid var(--border);border-radius:10px;padding:10px;margin:8px 0"><b style="font-size:13px">${e.file}</b><div style="font-size:12px;color:var(--muted)">${e.purpose||''}</div>${e.build?`<pre style="margin-top:8px;position:relative"><button class="copy" onclick="copyText(this.nextSibling.innerText)">copy</button><code class="language-bash">${e.build}</code></pre>`:''}</div>`).join('')}</div>`; }
  modEl.innerHTML=html; if(window.Prism) Prism.highlightAllUnder(modEl); crumbs.innerHTML=`<a href="#home">Learn</a> / <a href="#/m/${m.id}">${m.title}</a>`;
  const contentEl = modEl.querySelector('#mdContent'); const headings = contentEl.querySelectorAll('h2,h3'); headings.forEach(h=>{ if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-'); });
  if(headings.length){ tocEl.classList.remove('hidden'); tocEl.innerHTML=`<h4>On this page</h4>` + Array.from(headings).map(h=>`<a href="#${h.id}" data-h="${h.id}" style="padding-left:${h.tagName==='H3'?'12px':'0'}">${h.textContent}</a>`).join(''); const links = tocEl.querySelectorAll('a'); const obs = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){ links.forEach(a=>a.classList.toggle('active', a.dataset.h===e.target.id)); } }); }, {rootMargin:'-20% 0px -70% 0px', threshold:0}); headings.forEach(h=>obs.observe(h)); links.forEach(a=>a.addEventListener('click', e=>{ e.preventDefault(); document.getElementById(a.dataset.h).scrollIntoView({behavior:'smooth', block:'start'}); history.replaceState(null,'','#'+a.dataset.h); })); } else { tocEl.classList.add('hidden'); }
  contentEl.querySelectorAll('pre').forEach(pre=>{ if(pre.querySelector('.copy')) return; const code = pre.querySelector('code'); const lang = code && code.className.match(/language-(\w+)/)?.[1] || ''; if(lang){ const hdr=document.createElement('div'); hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;margin:-14px -14px 10px;padding:7px 10px;background:rgba(255,255,255,.04);border-bottom:1px solid var(--border);border-radius:10px 10px 0 0;font:600 11px var(--font-mono);color:var(--muted);letter-spacing:.3px'; hdr.innerHTML=`<span>${lang}</span><span style="opacity:.6">SysProgs</span>`; pre.style.paddingTop='0'; pre.prepend(hdr); } const b=document.createElement('button'); b.textContent='copy'; b.className='copy'; b.style.top = lang ? '42px' : '8px'; b.onclick=()=>copyText(code ? code.innerText : pre.innerText); pre.style.position='relative'; pre.appendChild(b); });
  showTab('module'); if(isMobile()) closeDrawer();
}
function renderProgress(){
  const checks=getChecks(); let html=`<div class="card"><h3>Progress</h3><div class="progress"><i style="width:${pct()}%"></i></div><p style="color:var(--muted)">${doneCount()} / ${DATA.modules.length} • ${pct()}%</p><button class="btn small" onclick="if(confirm('Reset progress?')){localStorage.removeItem('${key}');renderSide();renderHome(q.value);renderProgress();}">Reset</button></div>`;
  html+=`<div class="card">${DATA.modules.map(m=>`<label class="row" style="padding:7px 0;border-bottom:1px solid var(--border)"><input type="checkbox" class="check" ${checks[m.id]?'checked':''} onchange="toggleCheck('${m.id}',this.checked)"/> ${m.id} — ${m.title} <span style="margin-left:auto;color:var(--muted);font-size:12px">${m.time||''}</span></label>`).join('')}</div>`; progEl.innerHTML=html; crumbs.textContent='Progress'; tocEl.classList.add('hidden');
}
window.openModule=id=>{ location.hash='#/m/'+id; };
window.toggleCheck=(id,v)=>{ const c=getChecks(); c[id]=v; setChecks(c); renderSide(q.value); renderHome(q.value); renderProgress(); if(current) renderModule(current); };
window.copyText=t=>{ navigator.clipboard.writeText(t); toast('copied'); };
function toast(msg){ const b=document.createElement('div'); b.textContent=msg; b.style.cssText='position:fixed;bottom:76px;left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--border);padding:6px 10px;border-radius:999px;z-index:20'; document.body.appendChild(b); setTimeout(()=>b.remove(),900); }
function isMobile(){ return window.innerWidth <= 900; }
function showTab(t){ document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active', b.dataset.tab===t)); homeEl.classList.toggle('hidden', t!=='home'); modEl.classList.toggle('hidden', t!=='module'); progEl.classList.toggle('hidden', t!=='progress'); if(t==='home'){ tocEl.classList.add('hidden'); crumbs.textContent='Learn / Overview'; } }
function openDrawer(){
  if(isMobile()){ sidebar.classList.add('open'); overlay.classList.remove('hidden'); }
  else { document.querySelector('.app').classList.remove('sidebar-collapsed'); sidebar.classList.add('open'); }
}
function closeDrawer(){
  if(isMobile()){ sidebar.classList.remove('open'); overlay.classList.add('hidden'); }
  else { document.querySelector('.app').classList.add('sidebar-collapsed'); }
}
function toggleDrawer(){ if(isMobile()){ sidebar.classList.contains('open') ? closeDrawer() : openDrawer(); } else { document.querySelector('.app').classList.contains('sidebar-collapsed') ? openDrawer() : closeDrawer(); } }
$('#openSide').onclick=toggleDrawer; $('#closeSide').onclick=closeDrawer; overlay.onclick=closeDrawer;
window.addEventListener('resize', ()=>{ if(!isMobile()){ overlay.classList.add('hidden'); } });
document.querySelectorAll('.nav button[data-tab]').forEach(b=> b.addEventListener('click', ()=>{ location.hash = b.dataset.tab==='home'?'#home':'#'+b.dataset.tab; closeDrawer(); }));
window.addEventListener('hashchange', handleHash);
function renderLecture(mid, lid){
  const m=DATA.modules.find(x=>x.id===mid); if(!m) return; const l=(m.lectures||[]).find(x=>x.id===lid); if(!l) return; current=mid;
  const htmlMd = marked.parse(l.content||`# ${l.title}\n\nLecture note.`);
  let html=`<div class="card"><div style="font:600 11px var(--font-mono);color:var(--faint)">LECTURE • ${m.phase} • ${mid}</div><h2 style="margin:6px 0 8px">${l.title}</h2><div class="row"><a class="btn small" href="#/m/${mid}">← Back to ${m.title}</a><span class="badge">${lid}</span></div></div>`;
  html+=`<div class="card content" id="mdContent">${htmlMd}</div>`;
  modEl.innerHTML=html; if(window.Prism) Prism.highlightAllUnder(modEl); crumbs.innerHTML=`<a href="#home">Learn</a> / <a href="#/m/${mid}">${m.title}</a> / ${l.title}`;
  const contentEl = modEl.querySelector('#mdContent'); contentEl.querySelectorAll('pre').forEach(pre=>{
    if(pre.querySelector('.copy')) return; const code=pre.querySelector('code'); const lang=code&&code.className.match(/language-(\w+)/)?.[1]||''; const b=document.createElement('button'); b.textContent='copy'; b.className='copy'; b.style.top=lang?'42px':'8px'; b.onclick=()=>copyText(code?code.innerText:pre.innerText); pre.style.position='relative'; pre.appendChild(b);
  });
  showTab('module'); if(isMobile()) closeDrawer();
  // Re-trigger interactive SVG scan for newly added imgs
  setTimeout(()=> document.dispatchEvent(new Event('DOMContentLoaded')), 100);
}
function handleHash(){
  const h=location.hash||'#home';
  if(h.startsWith('#/m/')){
    const parts=h.slice(4).split('/');
    if(parts.length===2) renderLecture(parts[0], parts[1]);
    else renderModule(parts[0]);
  } else if(h==='#progress'){ renderProgress(); showTab('progress'); } else if(h==='#module' && current) renderModule(current); else { renderHome(q.value); showTab('home'); }
}
const clearQ=$('#clearQ'), searchMeta=$('#searchMeta');
function updateSearchMeta(filter){ const f=filter.toLowerCase(); const count = f ? DATA.modules.filter(m=> (m.id+m.title+m.desc).toLowerCase().includes(f)).length : DATA.modules.length; searchMeta.textContent = f ? `${count} result${count!==1?'s':''} for "${filter}"` : ''; clearQ.classList.toggle('hidden', !f); }
q.addEventListener('input', ()=>{ renderSide(q.value); renderHome(q.value); updateSearchMeta(q.value); });
clearQ.onclick=()=>{ q.value=''; renderSide(''); renderHome(''); updateSearchMeta(''); q.focus(); };
document.addEventListener('keydown', e=>{ if(e.key==='/' && document.activeElement!==q){ e.preventDefault(); q.focus(); } if(e.key==='Escape' && q.value){ q.value=''; renderSide(''); renderHome(''); updateSearchMeta(''); } });
let deferred=null; window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferred=e; const b=$('#installBtn'); b.style.display='inline-flex'; });
$('#installBtn')?.addEventListener('click', async()=>{ if(deferred){ deferred.prompt(); await deferred.userChoice; deferred=null; $('#installBtn').style.display='none'; }});
$('#themeBtn').onclick=()=>{
  const html=document.documentElement;
  const isDark = html.getAttribute('data-theme')==='dark';
  if(isDark){ html.removeAttribute('data-theme'); }
  else { html.setAttribute('data-theme','dark'); }
};
async function load(){
  const res=await fetch('./data/modules.json'); DATA=await res.json();
  // init sidebar state: desktop open, mobile closed
  if(!isMobile()){ document.querySelector('.app').classList.remove('sidebar-collapsed'); sidebar.classList.add('open'); }
  else { sidebar.classList.remove('open'); }
  renderSide(); renderHome(); renderProgress(); updateSearchMeta(''); handleHash();
}
load().catch(e=>{ homeEl.innerHTML=`<div class="card">Failed to load — run via http server: <code>python -m http.server --directory web</code> (${e})</div>`; });
