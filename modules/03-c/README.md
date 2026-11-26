# 03 — C: The Systems Lingua Franca

> **C *is* the OS tongue.** Kernels, drivers, DBs, embedded — all speak C. Master it and you can read any system.

## What & Why
C gives you manual memory, the preprocessor, UB, and the **POSIX/Win32** boundary (`open`/`ReadFile`, `fork`/`CreateProcess`, `mmap`/`VirtualAlloc`). No GC, no RAII — you manage every byte.

## Prerequisites
01 Hardware + 02 Assembly — you've seen `04 03 02 01` in RAM and `push rbp` in `objdump`.

## Outcomes
- Pointers, arrays, strings, function pointers — no confusion (`a[4]` decays to `int*`)
- `malloc`/`free` without leaks; implement **bump allocator** (`memory/01-bump-alloc.c` 40 lines)
- Explain stack vs heap, `sizeof` vs `strlen`, UB vs ID vs unspecified
- Use POSIX: `open/read/write/close`, `stat`, `fork/exec`, `mmap`, `socket`; Win32: `CreateFile/ReadFile`
- Debug with `gdb`, `valgrind`/`ASan`, `strace`/`Procmon`

## Sections
- `basics/` — pointers, decay, compile steps (`gcc -E/-S`)
- `memory/` — stack/heap, allocators, ASan
- `systems-api/` — files, env, copy (POSIX vs Win32 wrapper — `O_BINARY` matters)

## Examples
| File | Proves | Build |
|------|--------|-------|
| `basics/01-pointer-decay.c` | `sizeof(arr)` vs `sizeof(ptr)` | `gcc 01-pointer-decay.c -o decay.exe && ./decay.exe` |
| `memory/01-bump-alloc.c` | 40-line malloc, no free | `gcc 01-bump-alloc.c -o bump.exe && ./bump.exe` |
| `systems-api/01-file-io-compare.c` | `fopen/fgetc` vs `open/read` → `MATCH!` | `gcc 01-file-io-compare.c -o io.exe && ./io.exe file` |
| `systems-api/02-tiny-cp.c` | chunked `read/write` loop 4K | `gcc 02-tiny-cp.c -o cp.exe && ./cp.exe src dst` |
| `systems-api/03-env-args.c` | `argv`, `env`, `Sleep/usleep` | `gcc 03-env-args.c -o env.exe && ./env.exe hi` |

## Labs
- `labs/01-wc.md` — `wc -lwc` high vs low, compare to system `wc`
- `labs/02-bump-alloc.md` — free-list + coalesce, `LD_PRELOAD` as malloc

## Real-World
SQLite (~150K LOC C), Redis, Git, Linux kernel, Nginx — all C. Learn `strace` here and you can debug any of them.

## Next
→ `../04-cpp/README.md` — same control + RAII
