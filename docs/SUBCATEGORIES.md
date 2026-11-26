# SUBCATEGORIES — Lecture Notes Map (60 subcats, top → bottom)

> Each subcategory = one lecture note page with extensive detail + interactive SVG. Like a textbook, not a README.

## 00 Orientation (5)
- **00.1 What Is Systems Programming?** — app vs system, kitchen vs waiter, why bytes matter
- **00.2 Syscall vs Library** — FILE* vs fd, strace, kernel boundary (interactive: syscall layers)
- **00.3 Toolchain** — gcc/g++/nasm/gdb/python, mingw32 vs UCRT64, `gcc -E/-S`, `objdump`
- **00.4 Repo Map & How to Learn** — 20/30/40/10 loop, playground, bench
- **00.5 First Program** — hello via `write(1)` vs `printf`, PID, OS detection

## 01 Hardware (8)
- **01.1 Binary, Hex, Bits** — 0xFF = 0b11111111, hexdump
- **01.2 Two's Complement & Signed/Unsigned** — range, overflow, UB vs wrap
- **01.3 IEEE-754 Float** — 1+8+23, why 0.1+0.2≠0.3
- **01.4 Logic Gates → ALU → CPU Pipeline** — AND/OR/NOT → ADD → fetch/decode/execute
- **01.5 Registers, Flags, PC/SP** — rax, rflags, rsp/rbp, x0-x30, a0-a7
- **01.6 Memory Hierarchy** — registers 1c, L1 4c, RAM 80ns, SSD 50µs, cache line 64B, page 4K, TLB (interactive)
- **01.7 Endianness & Network Order** — `04 03 02 01` vs `01 02 03 04`, htonl (interactive)
- **01.8 Alignment & Padding** — `struct {char; int;}` 12 not 5, `offsetof`, `alignas(64)`

## 02 Assembly (7)
- **02.1 x86 (32-bit)** — `int 0x80`, segments, `hello.asm`
- **02.2 x86-64** — `syscall`, RIP-relative, `hello64.asm`, `stack-frame.asm`
- **02.3 ARM/AArch64** — `svc #0`, `x8`/`x0`, NEON, `hello_a64.s`
- **02.4 RISC-V** — `ecall`, `a7`/`a0`, `hello_rv.s`, open ISA
- **02.5 Inline ASM** — `asm volatile`, constraints, `cpuid`/`rdtsc` vs intrinsics
- **02.6 Calling Conventions** — SysV rdi… vs Win64 rcx… vs AAPCS64 x0… vs RISC-V a0… + red zone/shadow (interactive)
- **02.7 Stack Frames** — `push rbp; mov rbp,rsp; sub rsp,N` + callee/caller saved (interactive)

## 03 C (7)
- **03.1 Pointers, Arrays, Decay** — `a[4]` → `int*`, `sizeof` trap
- **03.2 Strings & C-Strings** — `char*` vs `char[]`, `strlen` vs `sizeof`
- **03.3 Compilation Pipeline** — `cpp → cc1 → as → ld` (`gcc -E/-S`) (interactive)
- **03.4 Stack vs Heap** — auto vs `malloc`/`free`, 1–8MB vs 80ns
- **03.5 Allocators** — bump (40 lines) → free-list → coalesce
- **03.6 UB vs ID vs Unspecified** — `*p` after free, `INT_MAX+1`, `f(a)+f(b)` order
- **03.7 POSIX vs Win32** — `open/read` vs `CreateFile/ReadFile`, `O_BINARY`, `fork` vs `CreateProcess`

## 04 C++ (5)
- **04.1 RAII & Rule of 0/5** — `ofstream` auto-close, ctor/dtor (interactive)
- **04.2 Move Semantics** — `std::move`, unique/shared, no copy
- **04.3 Templates vs Macros** — `if constexpr` vs `#define`
- **04.4 Smart Pointers, span, pmr** — `span<int>` vs `int*+len`
- **04.5 Filesystem, Threads, Atomics** — `fs::directory_iterator`, `thread`/`mutex`/`atomic`

## 05 Rust (5)
- **05.1 Ownership & Move** — one owner, `let t=s`
- **05.2 Borrowing & Lifetimes** — `&`/`&mut`, `Send`/`Sync`
- **05.3 Arc/Mutex, Option/Result** — safe concurrency
- **05.4 Unsafe & FFI** — `unsafe { libc::read }`, explicit boundary
- **05.5 Cargo, Tokio** — `cargo run` vs `tokio` `epoll`

## 06 Zig (3)
- **06.1 Explicit Allocator** — `Allocator` visible, `FixedBuffer` vs `page`
- **06.2 Comptime** — `comptime T`, vs macros/templates
- **06.3 Cross-compile** — `zig build-exe --target aarch64-linux`

## 07 Go (3)
- **07.1 Goroutines M:N** — 2KB stacks, work-stealing
- **07.2 Channels, select, context** — share by communicating
- **07.3 Netpoll & GC** — `epoll` under `net.Listen`, `GOGC`, `cgo`

## 08 Memory (4)
- **08.1 Virtual Memory & Paging** — VA→PA, 4K pages, TLB, huge pages (interactive)
- **08.2 Allocators** — bump → free-list → slab → jemalloc, fragmentation
- **08.3 Cache Coherence MESI** — M/E/S/I, false sharing `alignas(64)` (interactive)
- **08.4 NUMA** — node-local alloc, cross-node latency

## 09 OS (3)
- **09.1 Processes vs Threads** — `fork/exec/wait` vs `pthread_create`
- **09.2 Syscalls & Scheduling** — trap, `rax`/`x8`/`a7`, CFS, `nice`
- **09.3 Containers** — namespaces, cgroups, `unshare`/`chroot`/`seccomp`

## 10 Concurrency (4)
- **10.1 Threads & Atomics** — `pthread`, `std::atomic`, TSO vs weak
- **10.2 Locks** — spin (`xchg`), mutex (`futex`), RWLock
- **10.3 Lock-free** — CAS, ABA, hazard pointers
- **10.4 Async** — `epoll` vs `io_uring` (readiness vs completion) (interactive)

## 11 I/O (3)
- **11.1 I/O Paths** — `read` vs `mmap` vs `sendfile` vs `io_uring`
- **11.2 Filesystems** — inode/dentry, ext4/NTFS, journaling, `stat`
- **11.3 Durability & WAL** — `fsync`, append + `fsync` + replay, torn write

## 12 Networking (3)
- **12.1 Sockets TCP/UDP** — `socket/bind/listen/accept`, `TIME_WAIT`
- **12.2 DNS & HTTP** — UDP `A` record, `GET /` `200 OK`, keep-alive
- **12.3 Scalable I/O** — `epoll`/`kqueue`/`IOCP` for 10K conns

## 13 Security (3)
- **13.1 Overflow & ROP** — `strcpy` smash, canary/DEP/ASLR, `checksec`
- **13.2 TOCTOU & Privilege** — `O_NOFOLLOW`, `access→open` race
- **13.3 Sandboxing & Fuzzing** — `seccomp`, `AFL++`/`libFuzzer` + `ASan`

## 14 Toolchains (3)
- **14.1 Compilers** — lex→parse→IR→opt→codegen (LLVM), `clang -S -emit-llvm`
- **14.2 Linkers & Build** — relocations, `nm`/`ldd`, Make→CMake→Ninja→Bazel
- **14.3 Debug & Profile** — `gdb` `si`/`info reg`, `perf`/`pprof`, `ASan`/`TSan`

## 15 Capstones (5 options, pick 1–2)
- **15.A Tiny Shell** — `fork`/`exec`, `|` pipes, `>` redirect, `&` jobs
- **15.B KV Store** — hash + `mmap` WAL + `fsync` + crash recovery
- **15.C HTTP Server** — `epoll`/`io_uring` + `sendfile` + `wrk`
- **15.D Allocator** — `malloc`/`free` free-list + `LD_PRELOAD`
- **15.E Multi-ISA strlen** — hand ASM x64+A64+RV vs intrinsic, bench

> Next: each subcategory becomes `modules/XX/sub/YY.md` with lecture note (1000+ words, code, interactive SVG, lab). Start with 00.2 + 01.6 + 02.6/02.7 as proof.
