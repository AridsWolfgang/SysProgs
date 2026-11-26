# BUILD: riscv64-linux-gnu-gcc hello_rv.s -o hello_rv -nostdlib -static && qemu-riscv64 ./hello_rv
    .data
msg: .ascii "Hello RISC-V (ecall)\n"
    .text
    .globl _start
_start:
    li a7, 64
    li a0, 1
    la a1, msg
    li a2, 21
    ecall
    li a7, 93
    li a0, 0
    ecall
