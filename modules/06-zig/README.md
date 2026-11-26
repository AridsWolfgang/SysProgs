# 06-zig — Zig — Allocators & Comptime
Phase: Phase III — Moderns
Desc: Explicit Allocator, comptime vs macros/templates, cross-compile.

Concepts: # 06 — Concepts: Allocator Is Visible

## Every Allocation Takes an Allocator

```zig
var gpa = std.heap.GeneralPurposeAllocator(.{}){};
const a = gpa.allocator();
const s = try a.alloc(u8, 5); // exp...
