# 02 — Assembly: All Flavors

> **The truth layer. Everything above compiles here.** If you can't read it, you can't debug optimized code.

## What & Why
High-level languages hide the machine. Assembly reveals it: registers, stack, syscalls, ABIs. Learn 4 ISAs so you can read any `objdump -d`, debug any crash, and understand how C/Rust/Go actually call each other. This is the **CORE** — do x64 + one RISC properly.

## Prerequisites
01 Hardware — you know cache line 64B, little-endian, padding, and why `mov` goes through TLB.

## Outcomes
- Write, assemble, link, run in **x86** (32-bit, `int 0x80`), **x86-64** (`syscall`), **ARM/A64** (`svc`), **RISC-V** (`ecall`) — no libc for hello
- Read `objdump -d` / Godbolt and map to C: `push rbp; mov rbp,rsp; sub rsp,N`
- Explain stack frame, callee vs caller saved, red zone (SysV 128B), shadow space (Win64 32B), 16B alignment
- Translate a C function to hand ASM for 2 ISAs and back; use inline `asm volatile` safely from C/Rust
- Bench hand `strlen` vs `glibc` vs `-O2` intrinsic — know when hand wins (and when compiler does)

## Submodules

| Path | ISA | Bits | Assembler | Syscall | What you'll build |
|------|-----|------|-----------|---------|-------------------|
| `x86/` | Intel x86 | 32 | NASM `win32`/`elf32` | `int 0x80` | `hello.asm`, `add32.asm` |
| `x86-64/` | Intel/AMD | 64 | NASM `win64`/`elf64` | `syscall` | `hello64.asm`, `add.asm`, `stack-frame.asm` |
| `arm-aarch64/` | ARM | 32/64 | GAS | `svc #0` | `hello_a64.s` |
| `riscv/` | RISC-V | 32/64 | GAS | `ecall` | `hello_rv.s` |
| `inline-asm/` | — | — | GCC/Clang/MSVC/Rust | — | `cpuid.c`, `rdtsc.c` |
| `calling-conventions/` | — | — | Diagrams | — | SysV vs Win64 vs AAPCS64 vs RISC-V |

![Registers](./assets/diagrams/02-registers.svg)

## Examples (each minimal, runnable, header has BUILD)
- `hello.*` — exit via syscall, no libc
- `add.*` — function that adds two ints, observe `rdi/rsi→rax` (SysV) vs `rcx/rdx→rax` (Win64)
- `stack-frame.asm` — `push rbp; sub rsp,16; mov [rbp-8],0x1234` then `objdump -d`
- `inline-asm/cpuid.c` — `cpuid` via `asm("cpuid":...)` vs `<cpuid.h>`

## Labs
- `labs/01-strlen-4isa.md` — `strlen` in 4 ISAs, bench vs C (10M calls)
- `labs/02-calling-conv.md` — 7th arg on stack, clobber `rbx` without save → crash, fix with `push rbx`

## Real-World
`real-world.md` → Crypto (AES-NI/NEON), codecs, kernels (context switch saves callee regs), FFI

## Next
→ `../03-c/README.md` — C is the OS tongue; now you know what it compiles to
