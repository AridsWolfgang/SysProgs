# 00 — Concepts: What Is Systems Programming?

![Syscall Layers](./assets/diagrams/00-syscall-layers.svg)

## Normal vs System

**Normal:** `printf("hello")` — C library + OS do everything. You format, they buffer, they choose when to flush.

**System:** `write(1, "hello\n", 6)` — *you* talk to the kernel. You choose fd `1` (stdout), buffer `hello\n`, length `6`. No hidden buffering, no formatting. You pay in control, you gain in control.

> **System programming = direct OS interface via syscalls.** You get control, speed, and responsibility.

## The Three Layers (see SVG)

```
Your code
  → C library (glibc / msvcrt / musl) — friendly wrappers, buffering, `FILE*`
    → syscall trap (privilege boundary) — `syscall` (x64 Linux), `int 0x80` (x86), `svc #0` (ARM), `ecall` (RISC-V) — number in rax/x8/a7, args in rdi/x0/a0…
      → kernel — owns files, processes, network, memory; does the real work
```

* `printf("hi")` → `fwrite` (user buffer) → `write(1,"hi",2)` syscall → kernel writes to terminal.
* `fopen` gives `FILE*` — buffered, portable, `fgetc`/`fread`. `open` gives `int fd` — raw handle `3,4,5…`, `read(fd,buf,n)` — you buffer, you control exactly.
* `fileno(fp)` bridges them. Numbers are OS+arch specific: `write=1` on x64 Linux, `NtWriteFile` on Windows.

## Why It Matters

* **Tools:** `ls`, `grep`, `git`, `docker` — all syscall-heavy. If you can read `strace`/`Procmon`, you can debug any of them.
* **Performance:** 99% of apps use `FILE*`/`iostream` — fine. The 1% (`databases`, `game engines`, `browsers`) need raw `read`/`mmap`/`io_uring` for huge files, low latency, zero-copy (`sendfile`).
* **Understanding:** Every high-level bug (leak, race, file not found, `EPIPE`) is a syscall + kernel story underneath. If you only know `printf`, you guess. If you know `write`, you *know*.

## Mental Model for This Repo

* `playground/` — try anything, no grading.
* `modules/02-assembly` — truth: `gcc -S -O2 your.c` and read what the CPU actually gets. Godbolt > guessing.
* `modules/03-c/systems-api` — the `sys_*` wrapper layer: one `#ifdef _WIN32` in a header, clean API above. You write `sys_read`, it compiles everywhere.

## Key Test After This Module

Can you explain why `printf` and `write(1, …)` both print, but `strace` only shows `write`? And why changing `1→2` moves output from stdout to stderr (`2>` redirect)? If yes, you're ready for 01.

## Try Now

```bash
gcc modules/00-orientation/examples/00-hello-c.c -o hello_c.exe && ./hello_c.exe
# [LOW ] Hello via _write(fd=1)
# [HIGH] Hello via printf (FILE* stdout, buffered) — order may flip due to buffering — that's the lesson
```
