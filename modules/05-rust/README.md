# 05-rust — Rust — Safety Without GC
Phase: Phase III — Moderns
Desc: Ownership, borrow, Send/Sync, unsafe for syscalls, cargo/tokio.

Concepts: # 05 — Concepts: Ownership Is the OS

![Ownership](./assets/diagrams/05-ownership.svg)

## One Owner, Compile-Time Checked

```rust
let s = String::from("hi");
let t = s; // move — s is invalid now, c...
