# Real-World — Why Systems Programming?

* **Spotify / Netflix backend:** 10K concurrent connections → `epoll`/`io_uring`, `sendfile` zero-copy. Your `02` + `12` is literally their infra.
* **Chrome / Firefox:** Sandbox = `seccomp` + namespaces + `fork`/`clone` isolation. See `13` + `09`.
* **SQLite / Redis / Postgres:** One `fsync` misplacement = data loss on power cut. See `11` WAL lab.
* **Games (Unreal):** Arena allocators, cache-line padding (64B), hand ASM for physics. See `08` + `02`.
* **Embedded (32KB RAM):** No OS — you *are* the OS. C + ASM only. See `03` + `02-riscv`.

> Every app stands on syscalls. Systems programmers are the foundation.
