#ifndef __dbg_h__
#define _dbg_h__
#define __file__ (strrchr(__FILE__, '/')?(strrchr(__FILE__, '/')+1):__FILE__)
#if 1
#define dbg(fmt, ...) printf("%s(%d)@%s:" fmt "\n", __FUNCTION__, __LINE__, __file__, ## __VA_ARGS__)
#define dbge(fmt, ...) fprintf(stderr, "%s(%d)@%s:" fmt "\n", __FUNCTION__, __LINE__, __file__, ## __VA_ARGS__)
#else
#define dbg(fmt, ...) 
#endif

#endif
