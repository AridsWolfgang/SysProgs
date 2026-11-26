// BUILD: go run modules/07-go/examples/01-goroutine.go
package main
import ("fmt";"sync")
func main(){ var wg sync.WaitGroup; for i:=0;i<5;i++{wg.Add(1); go func(n int){defer wg.Done(); fmt.Println(n)}(i)}; wg.Wait()}
