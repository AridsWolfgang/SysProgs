# 08 — Concepts: Memory Is Everything

![Paging](./assets/diagrams/08-paging.svg)

## Virtual Memory

* Process sees contiguous `0..2^48` — kernel maps via **page tables** (4 levels on x64) to physical `PFN`. **TLB** caches `VPN→PFN` — miss = 4 memory reads (slow). `huge pages 2M/1G` reduce misses.
* `mmap`, `mprotect`, `getpagesize()` — see `examples/01-mmap.c` (`page 4096` on Win `GetSystemInfo`).

## Allocators

* **Bump:** `ptr+=size` — free = reset only (arena). Fast, no fragmentation.
* **Free-list:** linked list of holes, coalesce on free — fragmentation = holes.
* **Slab/jemalloc:** per-size caches, thread-local — what `malloc` actually is.

## Cache Coherence — MESI

* 64B line states: **M**odified, **E**xclusive, **S**hared, **I**nvalid — core writes → invalidates others → ping-pong if two threads share same line (**false sharing**). Fix: `alignas(64)`.
* NUMA — allocate on node you run on, else cross-node 2× latency.

> **Bench:** `bench/cache.c` stride 1 vs 16; `perf stat -e dTLB-load-misses` for thrashing.
