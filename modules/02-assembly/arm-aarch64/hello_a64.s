// BUILD: aarch64-linux-gnu-gcc hello_a64.s -o hello_a64 -nostdlib -static && qemu-aarch64 ./hello_a64
    .data
msg: .ascii "Hello AArch64 (svc #0)\n"
len = . - msg
    .text
    .global _start
_start:
    mov x8, #64
    mov x0, #1
    adr x1, msg
    mov x2, len
    svc #0
    mov x8, #93
    mov x0, #0
    svc #0
