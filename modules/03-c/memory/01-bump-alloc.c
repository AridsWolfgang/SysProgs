// BUILD: gcc modules/03-c/memory/01-bump-alloc.c -o bump.exe && ./bump.exe
#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#define HEAP_SIZE 4096
static uint8_t heap[HEAP_SIZE]; static size_t off=0;
void* bump_alloc(size_t n){n=(n+7)&~7;if(off+n>HEAP_SIZE)return NULL;void *p=&heap[off];off+=n;return p;}
int main(void){int *a=bump_alloc(sizeof(int)*4);for(int i=0;i<4;i++)a[i]=i*10;printf("a [%d %d %d %d] off=%zu\n",a[0],a[1],a[2],a[3],off);return 0;}
