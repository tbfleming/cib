// modification of eos-musl/include/bits/wchar.h
// fixed wchar_t

#pragma once

#include <bits/stdint.h>
#include <bits/stddef.h>

#ifndef __cplusplus
//typedef uint32_t wchar_t; // XXX is this correct?
typedef __WCHAR_TYPE__ wchar_t; // Nope. This is.
#endif

// if we support wstring make sure that this is correct
typedef wchar_t wint_t;
#define WEOF wchar_t(-1)

//struct mbstate_t;
