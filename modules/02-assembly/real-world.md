# Real-World — Hand ASM & ABIs

* **Crypto:** OpenSSL `aesni-x86_64.asm` (AES-NI) and ARM `sha1-armv8.pl` (NEON) — 10× over C. Your `cpuid.c` is how they detect CPU caps.
* **Codecs:** `libavcodec` hand SIMD for H.264 — `inline-asm/rdtsc.c` pattern for bench.
* **Kernels:** Context switch (`switch_to`) saves `rbx rbp r12-r15` + `rsp` — if you get calling conv wrong, you corrupt every thread. See `09 OS`.
* **FFI:** Python `ctypes`, Rust `extern "C"`, Go `cgo` — all rely on ABI matching exactly. One register off = stack smash.
* **Debugging:** `perf` and `gdb` show *this* — `si` (step instruction), `info registers`, `x/8xg $rsp`. If you can't read ASM, you can't debug `-O2`.
