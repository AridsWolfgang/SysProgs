# 03 — Concepts: C Is the OS

![Pipeline](./assets/diagrams/03-pipeline.svg)

## Compilation Pipeline — What `gcc` Actually Does

```
hello.c → [cpp] → hello.i  (preprocess: #include, #define)  — gcc -E
        → [cc1] → hello.s  (compile: C → ASM)               — gcc -S -O2  ← READ THIS (see 02)
        → [as]  → hello.o  (assemble: ASM → object)        — as / nasm
        → [ld]  → hello.exe (link: resolve printf from libc)
```

* **Preprocess:** Copy headers, expand macros. `gcc -E hello.c | head` shows 10K lines from `stdio.h`.
* **Compile:** The real work — C to ASM. `gcc -S -O2 hello.c -o hello.s` then `cat hello.s` — that's your 02 knowledge applied.
* **Assemble + Link:** `as` makes `.o` with relocations; `ld` patches them, pulls `libc`, writes ELF/PE.

> **Try:** `gcc -O0` vs `-O2` vs `-Os` on `pointer-decay.c` — `objdump -d` each, see 3× size/speed difference.

## UB vs Implementation-Defined vs Unspecified

* **UB ( nasal demons ):** `int x; printf("%d",x)` (uninitialized), `*p` after `free(p)`, signed overflow `INT_MAX+1`, `a[i]` out of bounds. Compiler may *delete* your check. Use `-Wall -Wextra -fsanitize=address,undefined`.
* **Implementation-defined:** `sizeof(int)` 4 on x86, `char` signedness — consistent per compiler, portable if you don't assume.
* **Unspecified:** order of `f(a)+f(b)` — compiler chooses.

```c
// UB that looks innocent
char *p = malloc(4); free(p);
printf("%c", p[0]); // use-after-free — ASan will catch, but C won't warn
```

## FILE* vs fd — The Core Idea

| Layer | Handle | Who buffers | Example | When |
|-------|--------|-------------|---------|------|
| HIGH | `FILE*` (C) / `ifstream` (C++) | C library | `fopen` → `fgetc` → `fclose` | 99% apps, portable |
| LOW | `int fd` (3,4,5…) | YOU | `open` → `read(buf,1024)` → `close` | tools, huge files, zero-copy |

* `fileno(fp)` bridges: `int fd = fileno(f);`
* `03-c/systems-api/01-file-io-compare.c` proves they count same bytes: `HIGH` vs `LOW` → `MATCH!` (fixed `O_BINARY` on Windows to avoid `\r\n` translation).
* **Windows trap:** `_open` without `_O_BINARY` translates `\n` ↔ `\r\n` — your `read` count will mismatch `fgetc`. Always `fopen(...,"rb")` and `_open(...,_O_BINARY)`.

## Stack vs Heap — Where Your Bytes Live

* **Stack:** `char buf[1024];` — auto, fixed at compile, 1–8MB limit, 1-cycle access, dies on return. Fast, limited.
* **Heap:** `malloc(1024);` — dynamic, `free` manual, fragmentation, leak if forget, ~80ns + syscall. Flexible, dangerous.
* **BSS/Data:** globals. **Text:** code.

```c
void foo(){ char stack[1<<20]; } // 1MB stack — may overflow (stack overflow)
char *p = malloc(1<<30); // 1GB heap — may fail (NULL), must free
```

> **Check:** `valgrind --leak-check=full ./a.out` or `gcc -fsanitize=address` — your 03 labs must pass.

## Cross-Platform Wrapper — One Ifdef, Clean API

All `#ifdef _WIN32` lives in one header, not scattered:

```c
int sys_read(int fd, void *buf, size_t n){
#ifdef _WIN32 return _read(fd,buf,n);
#else return read(fd,buf,n);
#endif
}
// You write sys_read — compiles on both
```

This is the `cross_platform.h` idea from the old playground — now you own it.
