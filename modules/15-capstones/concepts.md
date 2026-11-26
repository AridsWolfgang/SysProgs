# 15 — Capstones: Build & Ship

> **Talk is cheap. Ship something.**

Pick 1–2, 20h+ each. Deliverables: README (design), `bench/results/*.md`, `TESTING.md` (ASan/fuzz/crash).

* **A. Tiny Shell** — `fork`/`exec`, `|` pipes, `>` redirect, `&` jobs
* **B. KV Store** — hash index + `mmap` WAL + `fsync` durability + crash recovery
* **C. HTTP Server** — `epoll`/`io_uring`, thread pool, `sendfile`, keep-alive, `wrk -c 1000` vs Nginx
* **D. Allocator** — `malloc`/`free` free-list + coalescing, `LD_PRELOAD`
* **E. Multi-ISA strlen** — hand ASM x64+A64+RV vs intrinsic, bench

Grading: Bronze builds, Silver bench vs ref + ASan clean, Gold `git clone && make && bench` reproduces.

See `SPEC.md` for per-capstone spec.
