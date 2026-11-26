// BUILD: gcc modules/03-c/basics/01-pointer-decay.c -o decay.exe && ./decay.exe
#include <stdio.h>
void foo(int a[4]){printf("inside foo sizeof(a)=%zu (pointer)\n",sizeof(a));}
int main(void){int arr[4]={10,20,30,40};printf("main sizeof(arr)=%zu len=%zu\n",sizeof(arr),sizeof(arr)/sizeof(arr[0]));foo(arr);return 0;}
