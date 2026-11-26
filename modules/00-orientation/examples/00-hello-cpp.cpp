// BUILD: g++ modules/00-orientation/examples/00-hello-cpp.cpp -o hello_cpp.exe && ./hello_cpp.exe
// PURPOSE: C++ iostream vs C stdio — same syscall underneath
#include <iostream>
#ifdef _WIN32
  #include <windows.h>
#else
  #include <unistd.h>
#endif
int main(){
    std::cout<<"[C++ ] Hello via std::cout (iostream, RAII)"<<std::endl;
#ifdef _WIN32
    std::cout<<"PID: "<<GetCurrentProcessId()<<" OS: Windows"<<std::endl;
#else
    std::cout<<"PID: "<<getpid()<<" OS: Linux"<<std::endl;
#endif
    return 0;
}
