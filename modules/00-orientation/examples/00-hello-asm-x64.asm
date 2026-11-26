; BUILD (Linux): nasm -f elf64 modules/00-orientation/examples/00-hello-asm-x64.asm -o hello_asm.o && ld hello_asm.o -o hello_asm && ./hello_asm; echo $?
; PURPOSE: Minimal ASM — no libc, just a syscall.
section .data
msg db "Hello via ASM syscall (x86-64, no libc)", 10
len equ $ - msg
section .text
global _start
_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, len
    syscall
    mov rax, 60
    xor rdi, rdi
    syscall
