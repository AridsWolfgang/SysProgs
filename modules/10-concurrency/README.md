# 10-concurrency — Concurrency & Parallelism
Phase: Phase IV — The System
Desc: Threads, atomics, memory models, locks, lock-free, async.

Concepts: # 10 — Concepts: Concurrency

![Concurrency](./assets/diagrams/10-concurrency.svg)

## Atomics & Memory Models

* `std::atomic<int> x; x.fetch_add(1)` — indivisible even under race.
* **x86 TSO** stro...
