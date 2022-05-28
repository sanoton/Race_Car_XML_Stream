#ifndef __car_h__
#define _car_h__
#include "dbg.h"
typedef struct timestamp_s {
	long timestamp; 
	long sec; 
	long usec; 
	struct timestamp_s *pNext; 
	struct timestamp_s *pPrev; 
} timestamp; 
typedef struct user_s {
	char id[64]; 
	timestamp *pTimestampTab; 
	struct user_s *pNext; 
} user; 
int appendTimestamp(timestamp **ppTab, long sec, long usec);
void popTimestamp(timestamp **ppTab);
void cleanTimestamp(timestamp **ppTab); 
void dumpTimestamp(timestamp *pT);
int appendCar(user **ppTab, char *pId); 
user *getCarById(char *pId); 
void appendCarTimestamp(char *pId, long sec, long usec);
void popCar(user **ppTab);
void cleanCar(void);
void dumpCar(void);
void logCar(void); 
void analyzeCar(void);
extern long detect_oneloop_time; 
extern long filter_valid_time; 
extern int valid_times; 
#endif
