// BUILD: gcc modules/03-c/systems-api/01-file-io-compare.c -o io.exe && ./io.exe modules/03-c/systems-api/01-file-io-compare.c
#include <stdio.h>
#ifdef _WIN32
  #include <io.h>
  #include <fcntl.h>
  #define OPEN_READ _open
  #define READ _read
  #define CLOSE _close
#else
  #include <unistd.h>
  #include <fcntl.h>
  #define OPEN_READ open
  #define READ read
  #define CLOSE close
#endif
int main(int argc,char**argv){if(argc<2)return 1;long high=0,low=0;FILE*f=fopen(argv[1],"rb");int c;while((c=fgetc(f))!=EOF)high++;fclose(f);int fd=OPEN_READ(argv[1], _O_RDONLY|_O_BINARY);char buf[1024];int n;while((n=READ(fd,buf,sizeof(buf)))>0)low+=n;CLOSE(fd);printf("HIGH=%ld LOW=%ld %s\n",high,low,high==low?"MATCH!":"MISMATCH");return 0;}
