// BUILD: g++ -std=c++17 modules/04-cpp/systems/01-dir-list.cpp -o ls.exe && ./ls.exe .
#include <iostream>
#include <filesystem>
namespace fs=std::filesystem;
int main(int argc,char**argv){std::string p=argc>1?argv[1]:".";for(auto &e:fs::directory_iterator(p))std::cout<<e.path().string()<<" "<<(e.is_directory()?"[dir]":"[file]")<<"\n";return 0;}
