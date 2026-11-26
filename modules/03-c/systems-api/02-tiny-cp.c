// BUILD: gcc modules/03-c/systems-api/02-tiny-cp.c -o cp.exe && ./cp.exe src dst
#include <stdio.h>
#ifdef _WIN32
  #include <io.h>
  #include <fcntl.h>
  #define OPEN_R(f) _open(f,0)
  #define OPEN_W(f) _open(f,_O_CREAT|_O_WRONLY|_O_TRUNC,0644)
  #define READ _read
  #define WRITE _write
  #define CLOSE _close
#else
  #include <unistd.h>
  #include <fcntl.h>
  #define OPEN_R(f) open(f,O_RDONLY)
  #define OPEN_W(f) open(f,O_CREAT|O_WRONLY|O_TRUNC,0644)
  #define READ read
  #define WRITE write
  #define CLOSE close
#endif
int main(int argc,char**argv){if(argc!=3)return 1;int in=OPEN_R(argv[1]);int out=OPEN_W(argv[2]);char buf[4096];int n;long t=0;while((n=READ(in,buf,sizeof(buf)))>0){WRITE(out,buf,n);t+=n;}CLOSE(in);CLOSE(out);printf("copied %ld\n",t);return 0;}
