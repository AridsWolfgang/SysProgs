// BUILD: zig run examples/hello-worlds/hello.zig
const std=@import("std"); pub fn main() void { std.debug.print("hello Zig\n", .{}); }
