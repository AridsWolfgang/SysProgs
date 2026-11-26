# 02 — Concepts: The ISA Is the Contract

![Stack Frame](./assets/diagrams/02-stack-frame.svg)

## What an ISA Guarantees

* **Registers:** x86-64 16 GPRs (`rax rbx rcx rdx rsi rdi rbp rsp r8-r15` + `rip` + `rflags`), A64 31 (`x0-x30` + `sp`/`xzr`, `x29=fp`/`x30=lr`), RISC-V 32 (`x0(zero)-x31`, `x1=ra`/`x2=sp`). All are named 1-cycle storage.
* **Instructions:** `mov`, `add`, `cmp`/`jcc`, `call`/`ret`, `push`/`pop`, `syscall`/`svc`/`ecall`. Each is 1–15 bytes the decoder understands.
* **Memory model:** TSO (x86 strong) vs weak (ARM/RISC-V) — matters in `10-concurrency`.
* **Syscall ABI:** trap to kernel: x64 Linux `rax=sysno, rdi rsi rdx r10 r8 r9`, ARM `x8=sysno, x0-x5`, RISC-V `a7=sysno, a0-a5`.

![Calling Conventions](./assets/diagrams/02-calling-conv.svg)

## Stack Frames (the universal truth)

```
high addr
  [ arg n ... ]  ← caller's stack (7th+ arg spills here)
  [ ret addr  ]  ← pushed by `call` (8 bytes)
  [ saved rbp ]  ← push rbp; mov rbp,rsp  (frame pointer)
  [ locals    ]  ← sub rsp, N  (your vars, 16B aligned)
  [ …         ]
low addr → rsp  (stack grows down)
```

* `call foo` pushes return address; `ret` pops it. If you `sub rsp,5` without 16B align, `movaps` in callee faults.
* **Callee-saved:** `rbx rbp r12-r15` (SysV), `x19-x28` (A64), `s0-s11` (RISC-V) — *you* must preserve.
* **Caller-saved:** `rax rcx rdx rsi rdi r8-11` — can clobber, caller saves if needed.
* **Red zone** (SysV leaf only): 128B below `rsp` usable without `sub` — Win64 has **shadow space** 32B above ret for callee to spill `rcx/rdx/r8/r9`.

## Calling Conventions — The Handshake Between Languages

| ABI | int args | float args | return | shadow/red | who cleans |
|-----|----------|------------|--------|------------|------------|
| SysV AMD64 | rdi rsi rdx rcx r8 r9 | xmm0-7 | rax/xmm0 | red 128B | caller |
| Win64 | rcx rdx r8 r9 | xmm0-3 | rax | shadow 32B | caller (but callee may spill) |
| AAPCS64 | x0-x7 | v0-v7 | x0/v0 | — | caller |
| RISC-V | a0-a7 | fa0-fa7 | a0 | — | caller |

> **7th arg test:** `long foo(a,b,c,d,e,f,g)` — `g` lives at `[rsp+8]` on SysV, `[rsp+40]` on Win64 (shadow+stack). Get it wrong = read garbage. See `labs/02-calling-conv.md` + Godbolt `x64 gcc` vs `x64 msvc`.

![Registers](./assets/diagrams/02-registers.svg)

## Inline ASM (and why you usually shouldn't)

```c
// GCC/Clang: constraints tell compiler what's in/out/clobbered
uint64_t t; unsigned lo, hi;
__asm__ volatile("rdtsc" : "=a"(lo), "=d"(hi)); // rdtsc → edx:eax
t = ((uint64_t)hi<<32)|lo;
```
* `volatile` = don't delete/reorder; `"=a"` = output in `eax`; clobber = what you trash.
* **Prefer intrinsics** (`<immintrin.h>` `__rdtsc()`, `__cpuid()`) — compiler understands them for optimization. Inline ASM is for what intrinsics don't cover (`cpuid` leaf, `rdrand`).

> **Lab rule:** For every C function you write, `gcc -S -O2` it and read the ASM. Godbolt > guessing. Your `03 C` will make sense after this.
