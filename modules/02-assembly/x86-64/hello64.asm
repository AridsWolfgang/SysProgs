; BUILD (Linux): nasm -f elf64 hello64.asm -o hello64.o && ld hello64.o -o hello64 && ./hello64
section .data
msg db "Hello x86-64 syscall", 10
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
