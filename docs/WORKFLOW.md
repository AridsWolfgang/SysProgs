# WORKFLOW — How SysProgs Works

edit modules/*.md/*.c → python scripts/generate.py → web/data/modules.json → web PWA (vanilla, sidebar|reader|TOC) → learner checks → localStorage

No heavy stack: static web only, stdlib generate, python http.server
Run: python scripts/generate.py; python -m http.server 8000 --directory web
or: powershell -ExecutionPolicy Bypass -File scripts/run.ps1 → http://127.0.0.1:8000
Deploy: drop web/ to Pages (publish dir web)
