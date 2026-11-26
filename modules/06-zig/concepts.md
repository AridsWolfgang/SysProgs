# 06 — Concepts: Allocator Is Visible

## Every Allocation Takes an Allocator

```zig
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const a = gpa.allocator();
const s = try a.alloc(u8, 5); // explicit — no hidden malloc
defer a.free(s);
```

* No hidden heap — `FixedBufferAllocator` vs `page_allocator` swap changes where you allocate, visible in signature.
* `comptime` replaces C macros/C++ templates — `fn max(comptime T: type, a: T, b: T) T` — hygienic, debuggable.
* `errdefer`, `defer`, error unions vs exceptions — explicit.
* Cross-compile: `zig build-exe --target aarch64-linux -O ReleaseSmall` from Windows — no Docker.

> **Lab:** Port bump allocator to Zig; swap allocators, bench.
