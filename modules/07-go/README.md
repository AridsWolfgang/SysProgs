# 07-go — Go — Systems at Scale
Phase: Phase III — Moderns
Desc: Goroutines M:N, channels, netpoll (epoll), GC, cgo.

Concepts: # 07 — Concepts: Goroutines Are Cheap Threads

## M:N Scheduler

* Goroutine: 2KB stack, work-stealing, `GOMAXPROCS` threads. Spawn 100K — threads can't, goroutines can.
* Channels: `ch <- v`, `<-ch`,...
