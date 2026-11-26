# 01 — Concepts: The Machine Under Your Code

![Memory Hierarchy](./assets/diagrams/01-memory-hierarchy.svg)

## Von Neumann in 30 Seconds

```
 CPU (registers + ALU)  <->  Bus  <->  RAM  <->  Disk/SSD
         ↕                           ↕
      Cache L1/L2/L3           Memory controller
```

* **Registers:** ~16–32 slots inside CPU, 1-cycle access (`rax`, `rbx`, `x0`, `a0`). The fastest storage you have.
* **Cache:** SRAM, **64B lines**, hides RAM latency (L1 ~1ns/4c, L2 ~4ns/12c, L3 ~15ns/40c). Keep it in cache, you win.
* **RAM:** DRAM, ~80ns, 16–64GB, byte-addressable, 4KiB pages, TLB caches translations.
* **Disk/SSD:** 50µs–10ms, 512B–4K pages, via controller → bus.

> **Why cache matters:** Looping with stride 1 (use every byte of a 64B line) vs stride 16 (64B apart, waste 63/64) can be **10×** — same logic, different memory pattern. See `04-cache-stride.c`.

## Numbers Every Systems Programmer Knows (approx)

* L1 hit 1 ns, L2 4 ns, RAM 80 ns, SSD 50 µs, network 0.5–100 ms
* Cache line **64B** — false sharing killer (`alignas(64)`).
* Page **4KiB** — VM unit, TLB entry. Random 4K jumps thrash TLB, sequential wins.
* `mov rax, [mem]` still goes TLB → cache → RAM if miss.

## Bits & Representation

* **Binary/hex:** `0xFF = 255 = 0b11111111` — 1 hex digit = 4 bits. Hex is compact binary.
* **Two's complement:** `int8` range `-128..127`; `0xFF` = `-1`. Unsigned wraps, signed overflow is UB in C.
* **IEEE-754 float:** `float` = 1 sign + 8 exp + 23 mantissa — `0.1 + 0.2 != 0.3` (binary can't represent `0.1` exactly).

### Endianness

![Endian](./assets/diagrams/01-endian.svg)

* **x86 = little-endian** — least significant byte at low address. `0x01020304` stored as `04 03 02 01` in RAM on your laptop. **Network = big-endian** (`01 02 03 04` on wire).
* Bug: `fwrite(&hostInt,4)` on x86 writes `04 03 02 01`; `fread` on big-endian reads `0x04030201` — wrong. Fix: `fwrite(&htonl(host),4)` and `ntohl` on read. See `02-endian.c`.

## Alignment & Padding

```c
struct S { char a; int b; char c; }; // sizeof(S) == 12, not 6
// a at 0, padding 1-3, b at 4-7, c at 8, padding 9-11 to align to 4
// offsetof(S,a)=0, b=4, c=8 — compiler pads to keep int at 4B boundary
```

* CPU penalizes (or faults on ARM) unaligned `int` at odd addr. Padding trades space for speed.
* Rule: **sort fields descending by size** (`double 8 > int 4 > char 1`) to minimize padding. See `03-padding.c` — `struct A` wastes 6B per instance, `C` wastes 2B.

> **Lab preview:** You'll hexdump RAM, flip endian with `htonl`, and prove padding with `sizeof`/`offsetof` before the web ever shows you the answer.
