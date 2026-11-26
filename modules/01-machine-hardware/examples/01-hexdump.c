// BUILD: gcc modules/01-machine-hardware/examples/01-hexdump.c -o hexdump.exe && ./hexdump.exe
#include <stdio.h>
#include <stdint.h>
#include <string.h>
void hexdump(const void *p, size_t n){const unsigned char *b=p;for(size_t i=0;i<n;i++){printf("%02x ",b[i]);if((i+1)%16==0)printf("\n");}if(n%16)printf("\n");}
int main(void){const char *s="Hi\x00\xFF";printf("string bytes:\n");hexdump(s,5);printf("strlen=%zu vs 5\n",strlen(s));int x=0x01020304;printf("int 0x01020304 bytes (little => 04 03 02 01):\n");hexdump(&x,sizeof(x));return 0;}
