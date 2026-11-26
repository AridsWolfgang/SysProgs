#!/usr/bin/env python3
"""Live reload dev server — no heavy stack, stdlib only.
Serves web/ + watches modules/web/assets for changes → regenerates data + reloads browser via SSE.
Usage: python scripts/serve.py [--port 8000] [--no-generate]
"""
import argparse, http.server, socketserver, pathlib, threading, time, os, sys, json, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
PORT = 8000

# Files to watch
WATCH_GLOBS = [
    "modules/**/*.md",
    "modules/**/*.c", "modules/**/*.cpp", "modules/**/*.asm", "modules/**/*.s",
    "web/**/*",
    "assets/diagrams/*",
]

# SSE clients
clients = []
clients_lock = threading.Lock()

def get_watched_files():
    files = []
    for pat in WATCH_GLOBS:
        # Use rglob for ** patterns
        if "**" in pat:
            base, rest = pat.split("**", 1)
            base = ROOT / base.strip("/\\")
            suffix = rest.strip("/\\*")
            if suffix:
                for p in base.rglob(f"*{suffix}" if suffix.startswith(".") else suffix):
                    if p.is_file():
                        files.append(p)
            else:
                for p in base.rglob("*"):
                    if p.is_file():
                        files.append(p)
        else:
            for p in ROOT.glob(pat):
                if p.is_file():
                    files.append(p)
    # Also direct
    for p in [ROOT / "web" / "index.html", ROOT / "web" / "css" / "style.css", ROOT / "web" / "js" / "app.js", ROOT / "web" / "css" / "tokens.css", ROOT / "web" / "css" / "components.css"]:
        if p.exists() and p not in files:
            files.append(p)
    return files

def mtimes(files):
    return {str(p): p.stat().st_mtime for p in files if p.exists()}

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(WEB), **kw)
    def end_headers(self):
        # No cache for dev
        self.send_header("Cache-Control", "no-store, must-revalidate")
        super().end_headers()
    def do_GET(self):
        if self.path == "/__livereload":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            try:
                with clients_lock:
                    clients.append(self.wfile)
                # Keep open, heartbeat every 15s
                while True:
                    time.sleep(15)
                    try:
                        self.wfile.write(b": heartbeat\n\n")
                        self.wfile.flush()
                    except:
                        break
            except:
                pass
            finally:
                with clients_lock:
                    if self.wfile in clients:
                        clients.remove(self.wfile)
            return
        # Inject livereload script into HTML on the fly (so no need to edit index.html permanently)
        if self.path in ("/", "/index.html", "/design.html"):
            fpath = WEB / self.path.lstrip("/") if self.path != "/" else WEB / "index.html"
            if fpath.exists():
                data = fpath.read_bytes()
                inject = b'<script>/* live reload */(function(){if(location.hostname===\"127.0.0.1\"||location.hostname===\"localhost\"){var s=new EventSource(\"/__livereload\");s.onmessage=function(e){if(e.data===\"reload\")location.reload();};s.onerror=function(){setTimeout(function(){location.reload()},1000)}}})();</script>'
                # Insert before </body>
                if b"</body>" in data:
                    data = data.replace(b"</body>", inject + b"</body>")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)
                return
        return super().do_GET()

def watcher(generate=True):
    print(f"[watch] Watching {len(WATCH_GLOBS)} globs from {ROOT}")
    prev = mtimes(get_watched_files())
    while True:
        time.sleep(0.7)
        cur = mtimes(get_watched_files())
        changed = [k for k in cur if k not in prev or cur[k] != prev[k]] + [k for k in prev if k not in cur]
        if changed:
            print(f"[watch] changed: {changed[:3]}{' ...' if len(changed)>3 else ''}")
            if generate and any("modules" in c or "assets" in c for c in changed):
                try:
                    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate.py")], check=False)
                    print("[watch] regenerated web/data/modules.json")
                except Exception as e:
                    print("[watch] generate failed", e)
            # Notify browsers
            dead = []
            with clients_lock:
                for w in list(clients):
                    try:
                        w.write(b"data: reload\n\n")
                        w.flush()
                    except:
                        dead.append(w)
                for d in dead:
                    clients.remove(d)
            print(f"[watch] → reload {len(clients)} clients")
            prev = cur
        else:
            prev = cur

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=PORT)
    ap.add_argument("--no-generate", action="store_true")
    args = ap.parse_args()
    # Initial generate
    if not args.no_generate:
        subprocess.run([sys.executable, str(ROOT / "scripts" / "generate.py")], check=False)
    # Start watcher thread
    t = threading.Thread(target=watcher, kwargs={"generate": not args.no_generate}, daemon=True)
    t.start()
    # Serve
    class Threaded(socketserver.ThreadingMixIn, http.server.HTTPServer):
        daemon_threads = True
    addr = ("", args.port)
    with Threaded(addr, Handler) as httpd:
        print(f"[serve] Live reload at http://127.0.0.1:{args.port} (watching, no heavy stack)")
        print(f"[serve] Edit modules/*.md or web/* → auto generate + reload")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[serve] stopped")

if __name__ == "__main__":
    main()
