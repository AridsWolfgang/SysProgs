; BUILD: nasm -f win32 add32.asm -o add32.obj && gcc add_main32.c add32.obj -o add32.exe && ./add32.exe
global _my_add
section .text
_my_add:
    push ebp
    mov ebp, esp
    mov eax, [ebp+8]
    add eax, [ebp+12]
    pop ebp
    ret
