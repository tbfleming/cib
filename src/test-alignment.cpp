#include <cstddef>
#include <malloc.h>
#include <stdio.h>

int main() {
    printf("max alignment: %d\n", alignof(std::max_align_t));
    printf("malloc:        %p\n", malloc(0x800000));
    printf("malloc:        %p\n", malloc(16));
}
