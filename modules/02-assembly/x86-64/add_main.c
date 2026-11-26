// BUILD: nasm -f win64 add.asm -o add.obj && gcc add_main.c add.obj -o add_demo.exe && ./add_demo.exe
#include <stdio.h>
long my_add(long a,long b);
int main(void){printf("my_add(40,2)=%ld\n",my_add(40,2));return 0;}
