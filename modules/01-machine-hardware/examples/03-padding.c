// BUILD: gcc modules/01-machine-hardware/examples/03-padding.c -o padding.exe && ./padding.exe
#include <stdio.h>
#include <stddef.h>
struct A{char a;int b;char c;}; struct B{int b;char a;char c;};
int main(void){printf("A sizeof=%zu a=%zu b=%zu c=%zu\n",sizeof(struct A),offsetof(struct A,a),offsetof(struct A,b),offsetof(struct A,c));printf("B sizeof=%zu\n",sizeof(struct B));return 0;}
