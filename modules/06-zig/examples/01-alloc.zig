// BUILD: zig run modules/06-zig/examples/01-alloc.zig
const std=@import("std"); pub fn main() !void { var gpa=std.heap.GeneralPurposeAllocator(.{}){}; const a=gpa.allocator(); const s=try a.alloc(u8,5); defer a.free(s); @memcpy(s,"hello"); std.debug.print("{s}\n", .{s}); }
