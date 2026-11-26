// BUILD: gcc -O2 modules/01-machine-hardware/examples/04-cache-stride.c -o stride.exe && ./stride.exe
#include <stdio.h>
#include <time.h>
#define N (16*1024*1024)
static int arr[N];
int main(void){for(int i=0;i<N;i++)arr[i]=i;clock_t t0=clock();volatile long s=0;for(int it=0;it<4;it++)for(int i=0;i<N;i+=1)s+=arr[i];clock_t t1=clock();printf("stride1 %.3f s\n",(double)(t1-t0)/CLOCKS_PER_SEC);t0=clock();s=0;for(int it=0;it<4;it++)for(int i=0;i<N;i+=16)s+=arr[i];t1=clock();printf("stride16 %.3f s\n",(double)(t1-t0)/CLOCKS_PER_SEC);return 0;}
