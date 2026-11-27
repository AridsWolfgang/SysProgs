/* SysProgs structured lesson renderer — safe DOM construction for typed lesson blocks. */
(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const inlineMarkdown = value => {
    const safe = escapeHtml(value);
    return safe.replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  };
  const paragraphMarkdown = value => String(value ?? "").trim().split(/\n\s*\n/).map(p => {
    const lines = p.split("\n");
    if (lines.every(line => /^\s*[-*]\s+/.test(line))) return "<ul>" + lines.map(line => "<li>"+inlineMarkdown(line.replace(/^\s*[-*]\s+/, ""))+"</li>").join("") + "</ul>";
    return "<p>" + lines.map(inlineMarkdown).join("<br>") + "</p>";
  }).join("");
  const block = (tag, cls, text) => { const el=document.createElement(tag); if(cls) el.className=cls; if(text!==undefined) el.textContent=text; return el; };
  function renderBlock(item) {
    switch(item.type) {
      case "heading": return block("h"+item.level, "lesson-heading", item.text);
      case "prose": { const el=block("div","lesson-prose"); el.innerHTML=paragraphMarkdown(item.markdown); return el; }
      case "callout": { const el=block("section","lesson-callout tone-"+item.tone); el.append(block("strong","",item.title)); const body=block("div",""); body.innerHTML=paragraphMarkdown(item.markdown); el.append(body); return el; }
      case "image": { const figure=block("figure","lesson-figure"); const img=document.createElement("img"); img.src=item.src; img.alt=item.alt; img.loading="lazy"; img.addEventListener("error",()=>{img.hidden=true;figure.append(block("p","media-fallback","Diagram unavailable. "+item.alt));}); figure.append(img,block("figcaption","",item.caption)); if(item.attribution) figure.append(block("small","media-credit","Source: "+item.attribution)); return figure; }
      case "video": { const section=block("section","lesson-video"); section.append(block("h3","",item.title),block("p","muted",item.creator+(item.duration?" · "+item.duration:""))); const frame=document.createElement("iframe"); frame.src="https://www.youtube-nocookie.com/embed/"+encodeURIComponent(item.video_id)+(item.start_seconds?"?start="+item.start_seconds:""); frame.title=item.title; frame.loading="lazy"; frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"; frame.allowFullscreen=true; section.append(frame); if(item.why_watch) section.append(block("p","",item.why_watch)); const link=document.createElement("a"); link.href=item.fallback_url; link.target="_blank"; link.rel="noopener noreferrer"; link.textContent="Watch on YouTube ↗"; section.append(link); return section; }
      case "code": { const section=block("section","lesson-code"); const head=block("div","code-head",(item.filename||"Code example")+" · "+item.language); const button=block("button","copy-code","Copy"); button.type="button"; button.addEventListener("click",()=>navigator.clipboard?.writeText(item.source).then(()=>button.textContent="Copied")); head.append(button); const pre=document.createElement("pre"); const code=document.createElement("code"); code.className="language-"+item.language; code.textContent=item.source; pre.append(code); section.append(head,pre); if(item.explanation) section.append(block("p","muted",item.explanation)); if(item.build_command) section.append(block("p","build-command","Build: "+item.build_command)); if(item.expected_output) {const details=document.createElement("details"); details.append(block("summary","","Expected output")); details.append(block("pre","expected-output",item.expected_output)); section.append(details);} return section; }
      case "resource": { const a=document.createElement("a"); a.className="lesson-resource"; a.href=item.url; a.target="_blank"; a.rel="noopener noreferrer"; const title=block("strong","",item.title); const meta=block("small","",item.publisher+" · "+(item.kind||"resource")); const purpose=block("span","",item.purpose); a.append(title,meta,purpose); return a; }
      case "quiz": { const section=block("section","lesson-quiz"); section.append(block("h3","",item.question)); const feedback=block("p","quiz-feedback","Choose an answer to see feedback."); item.options.forEach((option,index)=>{const button=block("button","quiz-option",option);button.type="button";button.addEventListener("click",()=>{section.querySelectorAll("button").forEach(b=>b.disabled=true);button.classList.add(index===item.correct_option?"correct":"incorrect");feedback.textContent=(index===item.correct_option?"Correct. ":"Not quite. ")+item.explanation;});section.append(button);}); section.append(feedback); return section; }
      case "lab": { const section=block("section","lesson-lab"); section.append(block("h3","",item.title),block("p","",item.objective)); if(item.environment) section.append(block("p","muted","Environment: "+item.environment)); const list=document.createElement("ol"); (item.instructions||[]).forEach(step=>list.append(block("li","",step))); section.append(list); if(item.hints?.length){const details=document.createElement("details");details.append(block("summary","","Show hints"));const hints=document.createElement("ul");item.hints.forEach(h=>hints.append(block("li","",h)));details.append(hints);section.append(details);} const criteria=document.createElement("div");criteria.append(block("strong","","Completion checklist"));(item.completion_criteria||[]).forEach(text=>{const label=block("label","lab-check");const input=document.createElement("input");input.type="checkbox";label.append(input,document.createTextNode(text));criteria.append(label);});section.append(criteria);return section; }
      default: return block("p","media-fallback","Unsupported lesson content block: "+item.type);
    }
  }
  async function start() {
    const root=$("#lesson-root"); if(!root) return;
    const id=new URLSearchParams(location.search).get("id")||root.dataset.lessonId||"syscall-boundary";
    try {
      const response=await fetch("./data/lessons.json"); if(!response.ok) throw new Error("Lesson data could not be loaded.");
      const data=await response.json(); const lesson=data.lessons.find(item=>item.id===id);
      if(!lesson) throw new Error("This lesson could not be found.");
      document.title=lesson.title+" — SysProgs";
      root.replaceChildren();
      const header=block("header","lesson-header");
      header.append(block("p","eyebrow",lesson.module_id.replaceAll("-"," ")+" · "+lesson.difficulty),block("h1","",lesson.title));
      if(lesson.subtitle) header.append(block("p","lesson-subtitle",lesson.subtitle));
      const meta=block("div","lesson-meta",lesson.estimated_minutes+" min · "+lesson.learning_objectives.length+" learning objectives");
      header.append(meta); root.append(header);
      const outcomes=block("section","learning-outcomes");outcomes.append(block("h2","","What you'll learn"));const ul=document.createElement("ul");lesson.learning_objectives.forEach(o=>ul.append(block("li","",o)));outcomes.append(ul);root.append(outcomes);
      lesson.blocks.forEach(item=>root.append(renderBlock(item)));
      const nav=block("nav","lesson-navigation");const back=document.createElement("a");back.href="./index.html";back.textContent="← Back to learning catalogue";nav.append(back);root.append(nav);
    } catch(error) { root.replaceChildren(block("h1","","Lesson unavailable"),block("p","",error.message),block("a","","Return to SysProgs")); const link=root.querySelector("a");link.href="./index.html"; }
  }
  document.addEventListener("DOMContentLoaded",start);
})();
