// BUILD: gcc modules/02-assembly/inline-asm/cpuid.c -o cpuid.exe && ./cpuid.exe
#include <stdio.h>
#ifdef _MSC_VER
  #include <intrin.h>
#else
  #include <cpuid.h>
#endif
int main(void){
#ifdef _MSC_VER
    int info[4]; __cpuid(info,0); char v[13]; *(int*)&v[0]=info[1]; *(int*)&v[4]=info[3]; *(int*)&v[8]=info[2]; v[12]=0; printf("vendor %s\n",v);
#else
    unsigned int eax,ebx,ecx,edx; __asm__ volatile("cpuid":"=a"(eax),"=b"(ebx),"=c"(ecx),"=d"(edx):"a"(0)); char v[13]; *(unsigned int*)&v[0]=ebx; *(unsigned int*)&v[4]=edx; *(unsigned int*)&v[8]=ecx; v[12]=0; printf("vendor %s eax=%u\n",v,eax);
#endif
    return 0;
}
