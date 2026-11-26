# 11 — Concepts: Everything Is a File Descriptor

## I/O Paths

* `read(fd,buf,n)` → copy user→kernel→disk. `mmap` → map pages, `memcpy` no copy. `sendfile(out, in, ...)` → zero-copy file→socket (Kafka). `io_uring` → batched.
* **Buffering:** kernel page cache, `FILE*` buffer, `O_DIRECT` bypass, `fsync`/`fdatasync` for durability.

## Filesystems

* **Inode** (metadata) + **dentry** (name→inode) + **data blocks**. `ext4` journaling, `NTFS` MFT. `stat` → `st_ino`, `st_size`.

## Durability — WAL

* Write-ahead log: append + `fsync` → apply → crash → replay. Without `fsync`, `kill -9` tears write.

> **Lab:** `my_cat` via `read` vs `mmap` vs `sendfile` — bench 1GB; WAL without `fsync` → kill -9 → torn write.
