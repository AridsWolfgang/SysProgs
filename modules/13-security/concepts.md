# 13 — Concepts: Systems Bugs Are Security Bugs

## Classic Overflow

```c
char buf[16]; strcpy(buf, input); // 20 bytes → smash return address
```

* **Mitigations:** Canary (`__stack_chk_fail`), DEP/NX (no-exec stack), ASLR (randomize base), `FORTIFY`.
* **ROP:** chain `ret` gadgets — `checksec` shows what's on.

## TOCTOU & Sandbox

* `access()` then `open()` → symlink race — use `O_NOFOLLOW`, `openat`.
* **Sandbox:** `seccomp` filter syscalls, `pledge`, namespaces, capabilities.
* **Fuzz:** `AFL++`/`libFuzzer` on parser — `LLVMFuzzerTestOneInput` finds crash, `ASan` triages.

> **Lab:** Controlled overflow ( `-fno-stack-protector` ) → enable canary/ASLR → blocked; fuzz parser.
