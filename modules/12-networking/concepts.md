# 12 — Concepts: Systems Talk

## Sockets

```c
socket() → bind() → listen() → accept() // server
socket() → connect() // client
```

* **TCP:** handshake, retransmit, Nagle, `SO_REUSEADDR`, `TIME_WAIT`. `epoll` scales to 10K (`epoll_wait`).

## DNS & HTTP

* DNS: UDP query, parse `A` record — tiny resolver = `sendto` + parse.
* HTTP/1.1 `GET /` → `200 OK` over TCP; keep-alive, `Content-Length`; TLS adds handshake.

> **Lab:** Echo server trio: C+epoll vs Rust+tokio vs Go — bench `wrk -c 1000`; `netcat` clone.
