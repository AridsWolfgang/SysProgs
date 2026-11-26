// BUILD: gcc modules/03-c/systems-api/03-env-args.c -o env.exe && ./env.exe hello world
#include <stdio.h>
#include <stdlib.h>
#ifdef _WIN32
  #include <windows.h>
  #define SLEEP_MS(n) Sleep(n)
#else
  #include <unistd.h>
  #define SLEEP_MS(n) usleep((n)*1000)
#endif
int main(int argc,char**argv){printf("argc=%d\n",argc);for(int i=0;i<argc;i++)printf(" argv[%d]=%s\n",i,argv[i]);printf("PATH %.60s...\n",getenv("PATH")?getenv("PATH"):"(null)");printf("sleep 200ms...");fflush(stdout);SLEEP_MS(200);printf(" done\n");return 0;}
