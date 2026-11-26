# SysProgs — Systems Programming Learning Platform

> From transistors to threads. One repo to learn it all — properly.

SysProgs is a comprehensive, hands-on platform for Systems Programming: assembly (x86/x64/ARM/RISC-V) → C/C++/Rust/Zig/Go → OS, memory, concurrency, I/O, networking, security — with runnable examples and real use cases. No heavy stack. Static web PWA + terminal.

## Structure
```
SysProgs/
  docs/        # ROADMAP, GLOSSARY, HOW_TO_LEARN, WORKFLOW
  modules/     # 00..15 curriculum — each: README + concepts + examples + labs
  web/         # vanilla PWA (no bundler) — data from modules via generate.py
  bench/ playground/ examples/ scripts/
  CURRICULUM.md  # order, prereqs, outcomes, time
```

## Quick Start
```powershell
python scripts/generate.py
python -m http.server 8000 --directory web  # → http://127.0.0.1:8000
# or: powershell -ExecutionPolicy Bypass -File scripts/run.ps1
gcc --version; nasm -v; gdb --version
```

See `docs/WORKFLOW.md` for the full loop and `CURRICULUM.md` for the path. Start at `modules/00-orientation/README.md`.
