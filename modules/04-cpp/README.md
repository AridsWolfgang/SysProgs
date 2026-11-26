# 04 — C++: Zero-Cost Systems

> **C++ keeps C's control but adds zero-cost abstractions.** RAII, move, templates — same ASM, no leaks.

## What & Why
C++ is C with **RAII** (`ifstream` auto-closes), **move** (no copy), **templates** vs macros, `filesystem`/`thread`/`atomic`/`span` — all zero-cost, all in `std`. Learn when it helps and when it hides the machine (exceptions/RTTI).

## Prerequisites
03 C — pointers + syscalls solid, you've hit a leak and fixed it.

## Outcomes
- RAII: why `ifstream` needs no `close`, why `unique_ptr` beats raw `new`
- Move, Rule of 0/5, `span` vs `pointer+len`, `filesystem` vs `opendir`
- `std::thread`/`mutex`/`atomic`/`filesystem` — same `futex`/`stat` underneath
- Measure: prove RAII/`inline` are zero-cost via `objdump`/`bench`; know costs (exceptions, RTTI, implicit copies)

## Sections
- `basics/` — RAII file, refs vs pointers
- `memory-raii/` — `unique`/`shared`, `pmr`
- `systems/` — `dir-list` via `filesystem`, `thread-race`

## Examples
| File | Proves | Build |
|------|--------|-------|
| `basics/01-raii-file.cpp` | `ofstream` auto-close vs `fopen` leak | `g++ 01-raii-file.cpp -o raii.exe && ./raii.exe` |
| `memory-raii/01-unique-shared.cpp` | ownership, `move`, `use_count` | `g++ -std=c++17 01-unique-shared.cpp -o uniq.exe && ./uniq.exe` |
| `systems/01-dir-list.cpp` | `filesystem` vs `opendir` | `g++ -std=c++17 01-dir-list.cpp -o ls.exe && ./ls.exe .` |

## Labs
- Port `03-c/wc` to C++ with RAII + `filesystem::file_size`
- `ScopeGuard` vs manual `close(fd)` — measure

## Real-World
Chromium, Unreal, LLVM, Bloomberg, HFT — C++ for zero-cost + control.

## Next
→ `../05-rust/README.md` — ownership at compile time
