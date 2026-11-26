// BUILD: gcc -O2 modules/02-assembly/inline-asm/rdtsc.c -o rdtsc.exe && ./rdtsc.exe
#include <stdio.h>
#include <stdint.h>
static inline uint64_t rdtsc(void){unsigned lo,hi;__asm__ volatile("rdtsc":"=a"(lo),"=d"(hi));return ((uint64_t)hi<<32)|lo;}
int main(void){uint64_t a=rdtsc();volatile long s=0;for(int i=0;i<1000000;i++)s+=i;uint64_t b=rdtsc();printf("1M loop %llu cycles\n",(unsigned long long)(b-a));return 0;}
