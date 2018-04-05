// Copied from musl, added _index hack to prevent name collision

#include "time_impl.h"
#include <stdint.h>
#include <limits.h>
#include <stdlib.h>
#include <string.h>
#include "libc.h"

#define index _index

long  __timezone = 0;
int   __daylight = 0;
char *__tzname[2] = { 0, 0 };

weak_alias(__timezone, timezone);
weak_alias(__daylight, daylight);
weak_alias(__tzname, tzname);

static char std_name[TZNAME_MAX+1];
static char dst_name[TZNAME_MAX+1];
const char __utc[] = "UTC";

static int dst_off;
static int r0[5], r1[5];

static const unsigned char *zi, *trans, *index, *types, *abbrevs, *abbrevs_end;
static size_t map_size;

static char old_tz_buf[32];
static char *old_tz = old_tz_buf;
static size_t old_tz_size = sizeof old_tz_buf;

static volatile int lock[2];

static int getint(const char **p)
{
	unsigned x;
	for (x=0; **p-'0'<10U; (*p)++) x = **p-'0' + 10*x;
	return x;
}

static int getoff(const char **p)
{
	int neg = 0;
	if (**p == '-') {
		++*p;
		neg = 1;
	} else if (**p == '+') {
		++*p;
	}
	int off = 3600*getint(p);
	if (**p == ':') {
		++*p;
		off += 60*getint(p);
		if (**p == ':') {
			++*p;
			off += getint(p);
		}
	}
	return neg ? -off : off;
}

static void getrule(const char **p, int rule[5])
{
	int r = rule[0] = **p;

	if (r!='M') {
		if (r=='J') ++*p;
		else rule[0] = 0;
		rule[1] = getint(p);
	} else {
		++*p; rule[1] = getint(p);
		++*p; rule[2] = getint(p);
		++*p; rule[3] = getint(p);
	}

	if (**p=='/') {
		++*p;
		rule[4] = getoff(p);
	} else {
		rule[4] = 7200;
	}
}

static void getname(char *d, const char **p)
{
	int i;
	if (**p == '<') {
		++*p;
		for (i=0; (*p)[i]!='>' && i<TZNAME_MAX; i++)
			d[i] = (*p)[i];
		++*p;
	} else {
		for (i=0; ((*p)[i]|32)-'a'<26U && i<TZNAME_MAX; i++)
			d[i] = (*p)[i];
	}
	*p += i;
	d[i] = 0;
}

#define VEC(...) ((const unsigned char[]){__VA_ARGS__})

static uint32_t zi_read32(const unsigned char *z)
{
	return (unsigned)z[0]<<24 | z[1]<<16 | z[2]<<8 | z[3];
}

static size_t zi_dotprod(const unsigned char *z, const unsigned char *v, size_t n)
{
	size_t y;
	uint32_t x;
	for (y=0; n; n--, z+=4, v++) {
		x = zi_read32(z);
		y += x * *v;
	}
	return y;
}

/* Search zoneinfo rules to find the one that applies to the given time,
 * and determine alternate opposite-DST-status rule that may be needed. */

static size_t scan_trans(long long t, int local, size_t *alt)
{
	int scale = 3 - (trans == zi+44);
	uint64_t x;
	int off = 0;

	size_t a = 0, n = (index-trans)>>scale, m;

	if (!n) {
		if (alt) *alt = 0;
		return 0;
	}

	/* Binary search for 'most-recent rule before t'. */
	while (n > 1) {
		m = a + n/2;
		x = zi_read32(trans + (m<<scale));
		if (scale == 3) x = x<<32 | zi_read32(trans + (m<<scale) + 4);
		else x = (int32_t)x;
		if (local) off = (int32_t)zi_read32(types + 6 * index[m-1]);
		if (t - off < (int64_t)x) {
			n /= 2;
		} else {
			a = m;
			n -= n/2;
		}
	}

	/* First and last entry are special. First means to use lowest-index
	 * non-DST type. Last means to apply POSIX-style rule if available. */
	n = (index-trans)>>scale;
	if (a == n-1) return -1;
	if (a == 0) {
		x = zi_read32(trans + (a<<scale));
		if (scale == 3) x = x<<32 | zi_read32(trans + (a<<scale) + 4);
		else x = (int32_t)x;
		if (local) off = (int32_t)zi_read32(types + 6 * index[a-1]);
		if (t - off < (int64_t)x) {
			for (a=0; a<(abbrevs-types)/6; a++) {
				if (types[6*a+4] != types[4]) break;
			}
			if (a == (abbrevs-types)/6) a = 0;
			if (types[6*a+4]) {
				*alt = a;
				return 0;
			} else {
				*alt = 0;
				return a;
			}
		}
	}

	/* Try to find a neighboring opposite-DST-status rule. */
	if (alt) {
		if (a && types[6*index[a-1]+4] != types[6*index[a]+4])
			*alt = index[a-1];
		else if (a+1<n && types[6*index[a+1]+4] != types[6*index[a]+4])
			*alt = index[a+1];
		else
			*alt = index[a];
	}

	return index[a];
}

static int days_in_month(int m, int is_leap)
{
	if (m==2) return 28+is_leap;
	else return 30+((0xad5>>(m-1))&1);
}

/* Convert a POSIX DST rule plus year to seconds since epoch. */

static long long rule_to_secs(const int *rule, int year)
{
	int is_leap;
	long long t = __year_to_secs(year, &is_leap);
	int x, m, n, d;
	if (rule[0]!='M') {
		x = rule[1];
		if (rule[0]=='J' && (x < 60 || !is_leap)) x--;
		t += 86400 * x;
	} else {
		m = rule[1];
		n = rule[2];
		d = rule[3];
		t += __month_to_secs(m-1, is_leap);
		int wday = (int)((t + 4*86400) % (7*86400)) / 86400;
		int days = d - wday;
		if (days < 0) days += 7;
		if (n == 5 && days+28 >= days_in_month(m, is_leap)) n = 4;
		t += 86400 * (days + 7*(n-1));
	}
	t += rule[4];
	return t;
}
