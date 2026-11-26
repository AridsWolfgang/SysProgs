# 00 — Orientation

## What & Why
You are about to talk **directly to the OS**. This module kills confusion: what is "systems programming", what toolchain you need, and how this repo works. **No skipping.**

## Prerequisites
None. Terminal + curiosity.

## Outcomes
- Explain **syscall vs library call** with a concrete example (`printf` vs `write`) and show the trace
- Build and run 3 programs: **C**, **C++**, **ASM** hello-world on your machine (`mingw32` 32-bit now, 64-bit after upgrade)
- Verify toolchain: `gcc`, `g++`, `nasm`, `gdb`, `python` and know what each does
- Navigate `CURRICULUM.md`, `docs/WORKFLOW.md`, `docs/HOW_TO_LEARN.md` without help

## Examples
| File | Proves | Build |
|------|--------|-------|
| `examples/00-hello-c.c` | C `printf` (buffered `FILE*`) vs `write` (raw `fd`) | `gcc 00-hello-c.c -o hello_c.exe && ./hello_c.exe` |
| `examples/00-hello-cpp.cpp` | C++ `iostream` still ends at `write` | `g++ 00-hello-cpp.cpp -o hello_cpp.exe && ./hello_cpp.exe` |
| `examples/00-hello-asm-x64.asm` | ASM is what all languages compile to | `nasm -f elf64 ... && ld ...` (Linux) / `nasm -f win32` (your 32-bit) |

## Labs
- `labs/01-toolchain-check.md` — verify `gcc 6.3` (old, works for 00-03, upgrade to UCRT64 for 04+), `nasm 2.16`, `gdb`
- `labs/02-first-syscall.md` — comment out `printf`, keep `_write`/`write`, change `1→2` (stderr), reason about `strace`/`Procmon`

## Real-World
`real-world.md` → why Spotify, browsers, kernels all need system programmers — and how this module maps to them.

## Next
→ `../01-machine-hardware/README.md` (do not jump to 02 without 01)
