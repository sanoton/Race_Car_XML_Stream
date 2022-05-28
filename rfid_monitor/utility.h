#ifndef __utility_h__
#define _utility_h__
#include "dbg.h"
int SYSTEM(const char *format, ...);
int api_lock(char * filename); 
int api_unlock(int fd);
#endif
