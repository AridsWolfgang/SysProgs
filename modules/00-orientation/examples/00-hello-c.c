// BUILD: gcc modules/00-orientation/examples/00-hello-c.c -o hello_c.exe && ./hello_c.exe
// PURPOSE: C hello two ways — printf vs write
#include <stdio.h>
#include <string.h>
#ifdef _WIN32
  #include <io.h>
  #include <windows.h>
#else
  #include <unistd.h>
#endif
int main(void){
    printf("[HIGH] Hello via printf (FILE* stdout, buffered)\n");
#ifdef _WIN32
    const char *msg="[LOW ] Hello via _write(fd=1)\n"; _write(1,msg,(unsigned)strlen(msg));
    printf("PID: %lu OS: Windows\n",(unsigned long)GetCurrentProcessId());
#else
    const char *msg="[LOW ] Hello via write(fd=1)\n"; write(1,msg,strlen(msg));
    printf("PID: %d OS: Linux\n", getpid());
#endif
    return 0;
}
