// Interactive SVG — hover tooltip, click detail, wheel zoom — vanilla, no deps
(function(){
  // Tooltip
  const tip = document.createElement('div');
  tip.style.cssText = 'position:fixed;pointer-events:none;background:var(--card);color:var(--text);border:1px solid var(--border);padding:8px 10px;border-radius:8px;font:12px var(--font-sans);box-shadow:var(--shadow-md);display:none;z-index:30;max-width:260px';
  document.addEventListener('DOMContentLoaded', ()=> document.body.appendChild(tip));

  function attach(svg){
    // Hover tooltip
    svg.querySelectorAll('[data-tooltip]').forEach(el=>{
      el.style.cursor='pointer';
      el.addEventListener('mouseenter', e=>{
        tip.textContent = el.getAttribute('data-tooltip');
        tip.style.display='block';
      });
      el.addEventListener('mousemove', e=>{
        tip.style.left = (e.clientX+12)+'px';
        tip.style.top = (e.clientY+12)+'px';
      });
      el.addEventListener('mouseleave', ()=> tip.style.display='none');
      // Click detail
      el.addEventListener('click', ()=>{
        const detail = el.getAttribute('data-detail');
        if(detail){
          // Find or create detail box below SVG
          let box = svg.nextElementSibling;
          if(!box || !box.classList.contains('svg-detail')){
            box = document.createElement('div');
            box.className='svg-detail card';
            box.style.cssText='margin-top:8px;font:13px var(--font-sans);color:var(--muted)';
            svg.after(box);
          }
          box.textContent = detail;
          box.style.display = box.style.display==='none' ? 'block' : 'block';
          // Highlight
          svg.querySelectorAll('[data-tooltip]').forEach(x=> x.style.opacity='0.6');
          el.style.opacity='1';
          el.style.filter='brightness(1.2)';
        }
      });
    });
    // Wheel zoom (simple scale)
    let scale=1;
    svg.addEventListener('wheel', e=>{
      if(!e.ctrlKey && !e.metaKey) return; // only with ctrl
      e.preventDefault();
      scale += e.deltaY > 0 ? -0.05 : 0.05;
      scale = Math.max(0.6, Math.min(2, scale));
      svg.style.transform = `scale(${scale})`;
      svg.style.transformOrigin = 'center top';
    }, {passive:false});
  }

  // Auto-attach to all SVGs with data-interactive
  function scan(){
    document.querySelectorAll('svg[data-interactive]').forEach(attach);
    // Also inline SVGs loaded via <img> are not interactive — we use <object> or inline via fetch
    // For <img> with data-interactive-src, fetch and inline
    document.querySelectorAll('img[data-interactive-src]').forEach(img=>{
      fetch(img.getAttribute('data-interactive-src')).then(r=>r.text()).then(txt=>{
        const wrap=document.createElement('div');
        wrap.innerHTML=txt;
        const svg=wrap.querySelector('svg');
        if(svg){ svg.setAttribute('data-interactive',''); img.replaceWith(svg); attach(svg); }
      });
    });
  }
  document.addEventListener('DOMContentLoaded', scan);
  document.addEventListener('interactive-scan', scan);
  // Also after dynamic content (marked render)
  const obs=new MutationObserver(scan);
  document.addEventListener('DOMContentLoaded', ()=> obs.observe(document.body,{childList:true,subtree:true}));
})();
