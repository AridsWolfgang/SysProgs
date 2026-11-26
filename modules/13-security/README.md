# 13-security — Security
Phase: Phase IV — The System
Desc: Overflow, ROP, ASLR/DEP/Canary, TOCTOU, fuzz.

Concepts: # 13 — Concepts: Systems Bugs Are Security Bugs

## Classic Overflow

```c
char buf[16]; strcpy(buf, input); // 20 bytes → smash return address
```

* **Mitigations:** Canary (`__stack_chk_fail`), DEP...
