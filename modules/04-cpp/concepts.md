# 04 — Concepts: RAII & Zero-Cost

![RAII](./assets/diagrams/04-raii.svg)

## RAII — Resource Is Initialization

* **C:** `FILE *f = fopen(...); if (err) return; fclose(f);` — you close. Early `return`, `goto`, `throw` → leak if you forget one path.
* **C++:** `{ std::ofstream f("out.txt"); f << "hi"; }` — `f`'s destructor closes. Even on `throw`, even on early `return`. No leak, no `fclose` to remember.

> **Proof it's zero-cost:** `g++ -O2 raii.cpp -S` vs hand `fopen`/`fclose` — `objdump -d` shows same `call close` placement, no extra calls. Inlines disappear.

## Move — Don't Copy

```cpp
auto u = std::make_unique<int>(42); // unique: one owner
auto u2 = std::move(u); // transfers, no copy, u is null after
auto s = std::make_shared<int>(99); // shared: refcount
auto s2 = s; // count 2
```

* **Rule of 0/5:** If you manage a resource, define (or delete) all 5: ctor, dtor, copy, move, assign. Or use `unique_ptr`/`shared_ptr` and define none.
* `std::span` vs `pointer+len` — `void foo(int *p, size_t n)` becomes `void foo(span<int> s)` — bounds, no decay (see `03` decay lab).

## What C++ Hides (Costs You Should Know)

* **Exceptions:** `throw` unwinds stack — if you `-fno-exceptions`, smaller/fast. Know when you're paying.
* **RTTI:** `dynamic_cast`/`typeid` — extra data. `-fno-rtti` for embedded.
* **Implicit copies:** `auto x = bigVector;` copies. `auto &x = bigVector;` doesn't. `clang-tidy` catches.

## Zero-Cost Abstractions — Measure

* `inline`, `templates`, `if constexpr`, `string_view` compile to same ASM as hand C — **prove** with `bench/cache.c` and `objdump`.
* `filesystem::file_size(p)` vs `stat` — same syscall, nicer API.
* `thread`/`mutex`/`atomic` vs `pthread` — same `futex` underneath, but `std::jthread` joins on destruction (RAII again).

> **Lab:** Port `03-c/wc` to C++ with `ifstream` + `filesystem::file_size`, throw mid-read, prove file still closed (RAII) vs C leak.
