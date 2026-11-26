# 12-networking — Networking
Phase: Phase IV — The System
Desc: Sockets TCP/UDP, DNS, HTTP, epoll/kqueue.

Concepts: # 12 — Concepts: Systems Talk

## Sockets

```c
socket() → bind() → listen() → accept() // server
socket() → connect() // client
```

* **TCP:** handshake, retransmit, Nagle, `SO_REUSEADDR`, `TIME_WAI...
