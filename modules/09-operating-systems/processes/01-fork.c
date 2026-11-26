// BUILD: gcc modules/09-operating-systems/processes/01-fork.c -o fork.exe && ./fork.exe
#include <stdio.h>
#ifdef _WIN32
int main(){printf("fork -> CreateProcess on Windows\n");return 0;}
#else
#include <unistd.h>
#include <sys/wait.h>
int main(){pid_t p=fork();if(p==0){printf("child %d\n",getpid());return 0;}wait(NULL);printf("parent %d\n",getpid());return 0;}
#endif
