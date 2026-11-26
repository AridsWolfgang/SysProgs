# 01 — Machine & Hardware Foundations

## What & Why
Before ASM or C, understand the **machine they run on**. CPU, registers, RAM, cache, buses, endian, binary — this is the physics of systems. Without it, `struct padding` and `cache thrashing` look like magic.

## Prerequisites
00 Orientation — you can build `hello_c.exe`.

## Outcomes
- Draw Von Neumann block diagram from memory (CPU, RAM, I/O, bus)
- Convert binary ↔ hex ↔ dec, explain two's complement and IEEE-754, predict `0.1+0.2 != 0.3`
- Explain register vs cache vs RAM vs disk by **latency and size** (numbers every programmer knows)
- Predict endianness bug and fix with `htonl`; hexdump any file and read it
- Explain why `struct {char; int;}` is **12 bytes, not 5** — padding, alignment, cache line

## Topics
- Bits, bytes, hex, ASCII/UTF-8; gates → ALU → CPU pipeline (fetch/decode/execute)
- Registers, flags, PC, SP; memory hierarchy (see SVG)
- Endianness, alignment, padding; signed vs unsigned, overflow, float

## Examples
| File | Proves | Build |
|------|--------|-------|
| `examples/01-hexdump.c` | bytes on disk vs in memory, embedded `\0` | `gcc 01-hexdump.c -o hex.exe && ./hex.exe` |
| `examples/02-endian.c` | little vs big, `htonl`/`ntohl` | `gcc 02-endian.c -o endian.exe -lws2_32 && ./endian.exe` |
| `examples/03-padding.c` | struct layout via `sizeof`/`offsetof` | `gcc 03-padding.c -o pad.exe && ./pad.exe` |
| `examples/04-cache-stride.c` | stride 1 vs 16 (64B line) | `gcc -O2 04-cache-stride.c -o stride.exe && ./stride.exe` |

## Labs
- `labs/01-hexdump.md` — write `my_hexdump -C` without `xxd`
- `labs/02-struct-padding.md` — add `struct D`, predict `sizeof` before running, reorder to save bytes

## Real-World
Games pad for 64B lines. Network stacks always `htonl`. DBs tune page size (4KiB) and cache-line.

## Next
→ `../02-assembly/README.md`
