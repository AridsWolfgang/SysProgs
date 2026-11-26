# 05 — Concepts: Ownership Is the OS

![Ownership](./assets/diagrams/05-ownership.svg)

## One Owner, Compile-Time Checked

```rust
let s = String::from("hi");
let t = s; // move — s is invalid now, compiler error if you use s
println!("{}", t);
let r = &t; // borrow — checked, no data race
```

* **Ownership:** every value has one owner; move transfers; `Drop` frees (like RAII but checked).
* **Borrow checker:** `&` shared, `&mut` exclusive — no `use-after-free`, no `data race` at compile. `Send`/`Sync` for threads.
* **Result:** `Option`/`Result` not null, `Arc<Mutex<T>>` safe.

## Unsafe — Explicit Boundary

```rust
unsafe { libc::read(fd, buf as *mut _, len); } // you promise pointer valid
```

* Safe Rust can't do `mmap`, raw `syscall`, `*mut`. `unsafe` is the airlock — audit it, keep it tiny.
* Re-implement `03-c/cp` in safe Rust: `std::fs::copy` vs `libc::open` unsafe — compare `cargo run` vs `strace`.

> **Bench:** `Arc<Mutex>` vs `pthread_mutex` — Rust adds no overhead, but prevents race at compile.
