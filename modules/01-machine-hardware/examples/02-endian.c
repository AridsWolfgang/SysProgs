// BUILD: gcc modules/01-machine-hardware/examples/02-endian.c -o endian.exe -lws2_32 && ./endian.exe
#include <stdio.h>
#include <stdint.h>
#ifdef _WIN32
  #include <winsock2.h>
#else
  #include <arpa/inet.h>
#endif
int main(void){uint32_t host=0x01020304;unsigned char *b=(unsigned char*)&host;printf("host bytes: %02x %02x %02x %02x %s-endian\n",b[0],b[1],b[2],b[3],b[0]==0x04?"little":"big");uint32_t net=htonl(host);unsigned char *nb=(unsigned char*)&net;printf("htonl bytes: %02x %02x %02x %02x\n",nb[0],nb[1],nb[2],nb[3]);return 0;}
