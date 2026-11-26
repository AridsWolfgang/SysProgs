# 09 — Concepts: The OS Is the Ultimate System Program

## Processes vs Threads

* `fork()` duplicates addr space (CoW), `exec()` replaces, `wait()` reaps. `CreateProcess` on Win. `pthread_create` shares memory.
* **Syscall:** trap `syscall`/`svc`/`ecall` — `rax/x8/a7=sysno`, args in `rdi/x0/a0`. `strace ./a.out` shows every one.

## Scheduling

* CFS (Linux) — vruntime, `nice`, `chrt`. Affinity `taskset` pins to core (see `10`).

## Containers = Namespaces + Cgroups

* `unshare(CLONE_NEWPID)` → own PID 1, `chroot` → own `/`, `cgroup` → limit CPU/RAM, `seccomp` → filter syscalls. That's Docker.

```c
// mini-strace: ptrace(PTRACE_SYSCALL, child, 0,0); waitpid; peek regs
```

> **Lab:** Tiny shell (`fork`/`exec` + pipes) → mini-container (`unshare` + `chroot`).
