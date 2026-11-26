# 14-toolchains — Toolchains
Phase: Phase V — Mastery
Desc: Compilers lex→IR→opt→codegen, LLVM, build, debug, profile.

Concepts: # 14 — Concepts: What -O2 Actually Does

## Compiler

```
lex → parse → IR (LLVM) → opt passes → codegen → as → ld
              ↓
           clang -S -emit-llvm your.c → your.ll  — read it
```

* `-O...
