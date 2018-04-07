#include <exception>

void std::terminate() noexcept {
    abort();
}
