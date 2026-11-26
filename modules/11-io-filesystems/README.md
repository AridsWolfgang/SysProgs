# 11-io-filesystems — I/O & Filesystems
Phase: Phase IV — The System
Desc: read/mmap/sendfile/io_uring, ext4/NTFS, journaling, WAL.

Concepts: # 11 — Concepts: Everything Is a File Descriptor

## I/O Paths

* `read(fd,buf,n)` → copy user→kernel→disk. `mmap` → map pages, `memcpy` no copy. `sendfile(out, in, ...)` → zero-copy file→socket (Kafk...
