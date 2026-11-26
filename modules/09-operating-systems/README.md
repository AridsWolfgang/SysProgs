# 09-operating-systems — OS Internals
Phase: Phase IV — The System
Desc: Processes, syscalls, scheduling CFS, namespaces/cgroups.

Concepts: # 09 — Concepts: The OS Is the Ultimate System Program

## Processes vs Threads

* `fork()` duplicates addr space (CoW), `exec()` replaces, `wait()` reaps. `CreateProcess` on Win. `pthread_create` sha...
