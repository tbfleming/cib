unsigned __dso_handle = 0;

char* __cib_env[] = {nullptr};
char** __environ = __cib_env;

extern "C" void dynCall_vi(void (*f)(int), int i) { f(i); }

extern "C" void dynCall_viii(void (*f)(int, int, int), int i, int j, int k) {
    f(i, j, k);
}

int main() {}
