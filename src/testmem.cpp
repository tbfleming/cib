#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <emscripten.h>

int main() {
    printf("In main\n");
    EM_ASM(testJS());
}

extern "C" void test(const char* s) {
    const char* end = s + strlen(s) + 1;
    printf("input:    %p to %p\n", s, end);
    void* mem = malloc(1024);
    printf("new mem:  %p\n", mem);
    if (mem >= s && mem < end)
        printf("It overlaps\n");
}
