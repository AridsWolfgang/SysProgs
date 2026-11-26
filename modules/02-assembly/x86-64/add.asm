; BUILD (Linux): nasm -f elf64 add.asm -o add.o && gcc add_main.c add.o -o add_demo && ./add_demo
global my_add
section .text
my_add:
    push rbp
    mov rbp, rsp
%ifdef WIN32
    mov rax, rcx
    add rax, rdx
%else
    mov rax, rdi
    add rax, rsi
%endif
    pop rbp
    ret
