# 07 — Concepts: Goroutines Are Cheap Threads

## M:N Scheduler

* Goroutine: 2KB stack, work-stealing, `GOMAXPROCS` threads. Spawn 100K — threads can't, goroutines can.
* Channels: `ch <- v`, `<-ch`, `select` — share by communicating. `context` for cancel.
* `netpoll` — `net.Listen` uses `epoll` under the hood; one `Accept` loop handles 10K conns (see `12`).

```go
var wg sync.WaitGroup
for i:=0;i<100;i++{ wg.Add(1); go func(n int){ defer wg.Done(); fetch(n) }(i) }
wg.Wait()
```

* GC: `GOGC` tunes, `pprof` shows pauses; `cgo` calls C but pays `~100ns` boundary — measure.

> **Bench:** Go echo vs Rust tokio echo — same machine, `wrk -c 1000`.
