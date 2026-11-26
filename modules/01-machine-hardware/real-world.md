# Real-World — Hardware Matters

* **Games:** Struct-of-Arrays (SoA) keeps hot fields in same 64B lines — 3× FPS over Array-of-Structs. See `08` + `bench/cache.c`.
* **Databases:** Page size 4KiB vs 16KiB changes I/O; cache-line padding avoids false sharing in lock-free indexes (see `10`).
* **Networking:** Every `fwrite(&int)` without `htonl` is a bug waiting for AWS Graviton (AArch64). Your `02-endian.c` is the fix.
* **Embedded (32KB RAM):** 500 structs × 6 wasted padding = 3KB lost (10% of RAM). Sort fields.

> Memory layout is not academic — it's money and frames.
