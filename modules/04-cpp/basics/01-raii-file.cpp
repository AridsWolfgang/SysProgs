// BUILD: g++ modules/04-cpp/basics/01-raii-file.cpp -o raii.exe && ./raii.exe
#include <cstdio>
#include <fstream>
#include <iostream>
int main(){ {std::ofstream f("tmp_raii.txt"); f<<"hello";} FILE*fp=fopen("tmp_raii2.txt","w");fprintf(fp,"hello");fclose(fp); std::cout<<"both closed — RAII auto, C manual\n";return 0;}
