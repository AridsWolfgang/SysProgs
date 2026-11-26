// BUILD: gcc modules/08-memory-systems/examples/01-mmap.c -o mmap.exe && ./mmap.exe
#include <stdio.h>
#ifdef _WIN32
#include <windows.h>
int main(){SYSTEM_INFO si;GetSystemInfo(&si);printf("page %lu\n",(unsigned long)si.dwPageSize);return 0;}
#else
#include <unistd.h>
int main(){printf("page %ld\n",sysconf(_SC_PAGESIZE));return 0;}
#endif
