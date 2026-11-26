// BUILD: g++ -std=c++17 modules/04-cpp/memory-raii/01-unique-shared.cpp -o uniq.exe && ./uniq.exe
#include <memory>
#include <iostream>
int main(){auto u=std::make_unique<int>(42);std::cout<<"unique "<<*u<<"\n";auto s=std::make_shared<int>(99);std::cout<<"shared "<<s.use_count()<<"\n";auto s2=s;std::cout<<"after copy "<<s.use_count()<<"\n";return 0;}
