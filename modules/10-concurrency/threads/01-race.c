// BUILD: gcc modules/10-concurrency/threads/01-race.c -o race.exe && ./race.exe
#include <stdio.h>
#ifdef _WIN32
#include <windows.h>
long x=0;DWORD WINAPI inc(LPVOID a){for(int i=0;i<100000;i++)x++;return 0;}
int main(){HANDLE t1=CreateThread(NULL,0,inc,NULL,0,NULL),t2=CreateThread(NULL,0,inc,NULL,0,NULL);WaitForSingleObject(t1,INFINITE);WaitForSingleObject(t2,INFINITE);printf("x=%ld expect 200000\n",x);return 0;}
#else
#include <pthread.h>
int x=0;void* inc(void*a){for(int i=0;i<100000;i++)x++;return 0;}
int main(){pthread_t t1,t2;pthread_create(&t1,NULL,inc,NULL);pthread_create(&t2,NULL,inc,NULL);pthread_join(t1,NULL);pthread_join(t2,NULL);printf("x=%d\n",x);return 0;}
#endif
