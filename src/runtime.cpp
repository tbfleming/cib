#include <iostream>

unsigned __dso_handle = 0;

char* __cib_env[] = {nullptr};
char** __environ = __cib_env;

int main() { std::cout << ""; }
