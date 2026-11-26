# 10 — Concepts: Concurrency

![Concurrency](./assets/diagrams/10-concurrency.svg)

## Atomics & Memory Models

* `std::atomic<int> x; x.fetch_add(1)` — indivisible even under race.
* **x86 TSO** strong (stores ordered), **ARM weak** (can reorder) — `memory_order_acquire/release/seq_cst` matters. `litmus` test fails on ARM but passes on x86.

## Locks

* **Spinlock:** `xchg` loop — burns CPU, good for 1µs hold + pinned cores (HFT).
* **Mutex:** `futex` → kernel sleep if contended. `RWLock` for read-mostly.

## Lock-Free

* **CAS:** `compare_exchange(expected, desired)` loop — ABA problem, fix with hazard pointer/`crossbeam`.
* Not the same as wait-free.

## Async

* **Readiness:** `epoll`/`kqueue`/`IOCP` — tell when ready, you `read`.
* **Completion:** `io_uring` — submit SQ, reap CQ, zero syscalls. `tokio` (Rust) vs goroutines (Go M:N).

> **Bench:** `10-race.c` → `x=149k` not 200k (race) → fix with `atomic` or `mutex` + `ThreadSanitizer`.
