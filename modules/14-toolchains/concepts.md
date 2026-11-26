# 14 — Concepts: What -O2 Actually Does

## Compiler

```
lex → parse → IR (LLVM) → opt passes → codegen → as → ld
              ↓
           clang -S -emit-llvm your.c → your.ll  — read it
```

* `-O0` no opt (debug), `-O2` inlines + DCE, `-Os` size, `-O3` vectorizes. `objdump -d` shows 3× diff on `strlen`.

## Linker & Build

* Relocations, `nm`, `ldd`, `-fPIC`, static vs dynamic. `Make` → `CMake` → `Ninja` → `Bazel` — same project, 4 builds.

## Debug & Profile

* `gdb`: `b main`, `si`, `info reg`, `watch`, `catch syscall`. `perf`/`VTune`/`pprof`, `ASan`/`TSan`/`UBSan`.

> **Lab:** Compile `strlen` at `-O0`/`-O1`/`-O2`/`-O3`/`-Os`, `objdump` each, bench; debug `-O2` (DWARF lies).
