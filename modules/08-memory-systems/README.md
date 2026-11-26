# 08-memory-systems — Memory Systems
Phase: Phase IV — The System
Desc: VM, paging, TLB, allocators, MESI, NUMA, false sharing.

Concepts: # 08 — Concepts: Memory Is Everything

![Paging](./assets/diagrams/08-paging.svg)

## Virtual Memory

* Process sees contiguous `0..2^48` — kernel maps via **page tables** (4 levels on x64) to physica...
