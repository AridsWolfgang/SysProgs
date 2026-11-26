import pathlib, json, re
root = pathlib.Path(__file__).resolve().parent.parent
out = root / "web" / "data" / "modules.json"
defs = [
  ("00-orientation", "Orientation", "Phase I — The Machine", "What is systems programming, toolchain.", "beginner", "2–3h"),
  ("01-machine-hardware", "Machine & Hardware", "Phase I — The Machine", "CPU, cache, endian, padding.", "beginner", "6–8h"),
  ("02-assembly", "Assembly (All Flavors)", "Phase I — The Machine", "x86/x64/ARM/RV + inline + ABI.", "core", "20–30h"),
  ("03-c", "C — Systems Lingua Franca", "Phase II — Classics", "Pointers, malloc, POSIX/Win32.", "core", "20–25h"),
  ("04-cpp", "C++ — Zero-Cost Systems", "Phase II — Classics", "RAII, move, filesystem.", "core", "18–22h"),
  ("05-rust", "Rust — Safety Without GC", "Phase III — Moderns", "Ownership, unsafe.", "core", "14–18h"),
  ("06-zig", "Zig — Allocators", "Phase III — Moderns", "Explicit alloc, comptime.", "core", "8–12h"),
  ("07-go", "Go — Systems at Scale", "Phase III — Moderns", "Goroutines, netpoll.", "core", "10–14h"),
  ("08-memory-systems", "Memory Systems", "Phase IV — The System", "VM, TLB, MESI.", "core", "10–14h"),
  ("09-operating-systems", "OS Internals", "Phase IV — The System", "Processes, syscalls.", "core", "14–20h"),
  ("10-concurrency", "Concurrency", "Phase IV — The System", "Threads, atomics.", "core", "14–20h"),
  ("11-io-filesystems", "I/O & Filesystems", "Phase IV — The System", "read/mmap/WAL.", "core", "10–14h"),
  ("12-networking", "Networking", "Phase IV — The System", "Sockets, epoll.", "core", "12–18h"),
  ("13-security", "Security", "Phase IV — The System", "Overflow, fuzz.", "core", "8–12h"),
  ("14-toolchains", "Toolchains", "Phase V — Mastery", "Compilers, debug.", "core", "10–14h"),
  ("15-capstones", "Capstones", "Phase V — Mastery", "Shell/KV/httpd.", "capstone", "20h+"),
]
mods=[]
for id_, title, phase, desc, level, time in defs:
    mod_path = root / "modules" / id_
    readme_p = mod_path / "README.md"
    concepts_p = mod_path / "concepts.md"
    readme = readme_p.read_text(encoding="utf-8", errors="ignore") if readme_p.exists() else f"# {title}\n\n{desc}\n"
    concepts = concepts_p.read_text(encoding="utf-8", errors="ignore") if concepts_p.exists() else ""
    full = readme + ("\n\n---\n\n" + concepts if concepts else "")
    # Fix image paths for web: ../../assets -> ./assets
    full = full.replace("../../assets/diagrams", "./assets/diagrams")
    # examples
    examples=[]
    for pat in ["*.c","*.cpp","*.rs","*.zig","*.go","*.s","*.asm"]:
        for f in mod_path.rglob(pat):
            if f.suffix in [".exe",".obj",".o"]: continue
            rel = f.relative_to(root).as_posix()
            try:
                txt = f.read_text(encoding="utf-8", errors="ignore")
                m = re.search(r'PURPOSE:\s*(.*)', txt)
                purpose = m.group(1).strip() if m else ""
                b = re.search(r'BUILD:\s*(.*)', txt)
                build = b.group(1).strip() if b else ""
            except Exception:
                purpose=""; build=""
            examples.append({"file": rel, "purpose": purpose[:140], "build": build})
            if len(examples)>=6: break
        if len(examples)>=6: break
    # lectures (subcategories)
    lectures=[]
    lect_dir = mod_path / "lectures"
    if lect_dir.exists():
        for f in sorted(lect_dir.glob("*.md")):
            try:
                txt = f.read_text(encoding="utf-8", errors="ignore")
                # First heading as title
                mh = re.search(r'^#\s+(.*)', txt, re.M)
                ltitle = mh.group(1).strip() if mh else f.stem
                ltitle = ltitle.replace("Lecture ", "").strip()
                # Fix image paths
                txt = txt.replace("../../assets/diagrams", "./assets/diagrams").replace("../assets/diagrams","./assets/diagrams")
            except Exception:
                ltitle=f.stem; txt=""
            lectures.append({"id": f.stem, "title": ltitle, "file": f.relative_to(root).as_posix(), "content": txt[:18000]})
    mods.append({"id":id_,"title":title,"phase":phase,"desc":desc,"level":level,"time":time,"path":f"modules/{id_}","readme":full[:18000],"examples":examples,"lectures":lectures})
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({"modules":mods}, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"wrote {out} {len(mods)} modules, lectures total {sum(len(m['lectures']) for m in mods)}")
