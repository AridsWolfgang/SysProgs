// BUILD: nasm -f win32 add32.asm -o add32.obj && gcc add_main32.c add32.obj -o add32.exe && ./add32.exe
#include <stdio.h>
int my_add(int a,int b);
int main(void){printf("my_add(40,2)=%d\n",my_add(40,2));return 0;}
