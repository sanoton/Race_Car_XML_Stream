#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/time.h>
#include <time.h>
#include <string.h>
#include <pthread.h>
#include <string.h>

#include "car.h"

long detect_oneloop_time=5; 
long filter_valid_time=500000; 
int valid_times=5; 

int appendTimestamp(timestamp **ppTab, long sec, long usec){
	timestamp *pTAppend=NULL; 
	pTAppend=malloc(sizeof(timestamp)); 
	if(!pTAppend) goto err;
	memset(pTAppend, 0, sizeof(timestamp)); 
	pTAppend->sec=sec; 
	pTAppend->usec=usec; 
	pTAppend->pNext=NULL; 
	pTAppend->pPrev=NULL; 
	if(!*ppTab){
		*ppTab=pTAppend; 
	}else{
		timestamp *pT; 
		for(pT=*ppTab; pT; pT=pT->pNext){
			if(!pT->pNext){
				pT->pNext=pTAppend; 
				pTAppend->pPrev=pT; 
				break; 
			}
		}
	}
	return 0; 
err: 
	return -1; 
}

void popTimestamp(timestamp **ppTab){
	timestamp *pT=*ppTab; 
	if(pT){
		*ppTab=pT->pNext; 
		free(pT); 
	}
}

void cleanTimestamp(timestamp **ppTab){
	timestamp *pT=*ppTab; 
	while(pT){
		timestamp *pTNext=pT->pNext; 
		free(pT); 
		pT=pTNext; 
	}
	*ppTab=NULL; 
}

void dumpTimestamp(timestamp *pT){
	int count=0; 
	fprintf(stderr, "\n------------  dumpTimestamp  -------------\n"); 
	while(pT){
		fprintf(stderr, "%d: %ld-%ld ", count, pT->sec, pT->usec); 
		char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
		time_t timep=pT->sec; 
		struct tm *ptm;
		ptm = gmtime(&timep); 
		fprintf(stderr, "%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld\n", 
				1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
				wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, pT->usec/1000); 
		count++; 
		pT=pT->pNext; 
	}
	fprintf(stderr, "------------------------------------------\n"); 
	fflush(stderr); 
}

static user *pCarTab=NULL; 

int appendCar(user **ppTab, char *pId){
	user *pTAppend=NULL; 
	if((pTAppend=getCarById(pId))!=NULL){
		goto err; 
	}
	pTAppend=malloc(sizeof(user)); 
	if(!pTAppend) goto err;
	memset(pTAppend, 0, sizeof(user)); 
	strcpy(pTAppend->id, pId); 
	pTAppend->pTimestampTab=NULL; 
	pTAppend->pNext=NULL; 
	if(!*ppTab){
		*ppTab=pTAppend; 
	}else{
		user *pT; 
		for(pT=*ppTab; pT; pT=pT->pNext){
			if(!pT->pNext){
				pT->pNext=pTAppend; 
				break; 
			}
		}
	}
	return 0; 
err: 
	return -1; 
}

user *getCarById(char *pId){
	user *pT=pCarTab; 
	while(pT){
		if(!strcmp(pT->id, pId)){
			return pT; 
		}
		pT=pT->pNext; 
	}
	return NULL; 
}

void appendCarTimestamp(char *pId, long sec, long usec){
	user *pT=getCarById(pId); 
	if(pT) appendTimestamp(&pT->pTimestampTab, sec, usec); 
	else {
		appendCar(&pCarTab, pId); 
		pT=getCarById(pId); 
		appendTimestamp(&pT->pTimestampTab, sec, usec);
	}
}

void popCar(user **ppTab){
	user *pT=*ppTab; 
	if(pT){
		*ppTab=pT->pNext; 
		free(pT); 
	}
}

void cleanCar(void){
	user *pT=pCarTab; 
	while(pT){
		user *pTNext=pT->pNext; 
		cleanTimestamp(&pT->pTimestampTab); 
		free(pT); 
		pT=pTNext; 
	}
	pCarTab=NULL; 
}

void dumpCar(void){
	user *pT=pCarTab; 
	int count=0; 
	fprintf(stderr, "\n============  dumpCar  =============\n"); 
	while(pT){
		fprintf(stderr, "\n*************************************\n"); 
		fprintf(stderr, "%d: id(%s)\n", 
				count, pT->id); 
		dumpTimestamp(pT->pTimestampTab); 
		count++; 
		pT=pT->pNext; 
	}
	fflush(stderr); 
}

void logCar(void){
	user *pT=pCarTab; 
	while(pT){
		if(!access(pT->id, F_OK)) remove(pT->id); 
		int fd=open(pT->id, O_CREAT|O_WRONLY|O_APPEND, 00644); 
		if(fd>0){
			timestamp *pTT=pT->pTimestampTab; 
			while(pTT){
				char data[128]={0}; 
				sprintf(data, "%ld %ld ", pTT->sec, pTT->usec); 
				write(fd, data, strlen(data)); 
				char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
				time_t timep=pTT->sec; 
				struct tm *ptm;
				ptm = gmtime(&timep); 
				sprintf(data, "%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld\n", 
						1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
						wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, pTT->usec/1000); 
				write(fd, data, strlen(data)); 
				pTT=pTT->pNext; 
			}
			close(fd); 
		}
		pT=pT->pNext; 
	}
}

void analyzeCar(void){
	user *pT=pCarTab; 
	while(pT){
		char op[128]={0}; 
		sprintf(op, "%s_op", pT->id); 
		if(!access(op, F_OK)) remove(op); 
		int fd=open(op, O_CREAT|O_WRONLY|O_APPEND, 00644); 
		if(fd>0){
			timestamp *pTT=pT->pTimestampTab; 
			timestamp *pTTPrev=NULL; 
			timestamp *pTTTmp=NULL; 
			while(pTT){
				if(!pTTPrev){
					int oneLoopDone=0; 
					pTTTmp=pTT; 
					while(pTTTmp){
						if(pTTTmp->pNext){
							if((pTTTmp->pNext->sec-pTTTmp->sec)>detect_oneloop_time){
								pTT=pTTTmp; 
								oneLoopDone=1; 
								break; 
							}
						}
						pTTTmp=pTTTmp->pNext; 
					}
					if(oneLoopDone==1 && pTT){
						int count=0; 
						pTTTmp=pTT; 
						while(pTTTmp){
							if(pTTTmp->pPrev){
								long sec=0, usec=0; 
								sec=(pTTTmp->sec-pTTTmp->pPrev->sec); 
								usec=(pTTTmp->usec-pTTTmp->pPrev->usec); 
								if((1000000*sec+usec)<filter_valid_time){
									count++; 
								}
							}
							if(count>(valid_times-1)) break; 
							pTTTmp=pTTTmp->pPrev; 
						}
						if(count>(valid_times-1)){
							pTT=pTTTmp; 
							do {
								char data[128]={0}; 
								sprintf(data, "%ld %ld ", pTT->sec, pTT->usec); 
								write(fd, data, strlen(data)); 
								char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
								time_t timep=pTT->sec; 
								struct tm *ptm;
								ptm = gmtime(&timep); 
								sprintf(data, "%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld\n", 
										1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
										wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, pTT->usec/1000); 
								write(fd, data, strlen(data)); 
							} while(0); 
						}
					}
				}else{
					if((pTT->sec-pTTPrev->sec)>detect_oneloop_time){
						int count=0; 
						pTTTmp=pTT; 
						while(pTTTmp){
							if(pTTTmp->pNext){
								long sec=0, usec=0; 
								sec=(pTTTmp->pNext->sec-pTTTmp->sec); 
								usec=(pTTTmp->pNext->usec-pTTTmp->usec); 
								if((1000000*sec+usec)<filter_valid_time){
									count++; 
								}
							}
							if(count>(valid_times-1)) break; 
							pTTTmp=pTTTmp->pNext; 
						}
						if(count>(valid_times-1)){
							pTT=pTTTmp; 
							do {
								char data[128]={0}; 
								sprintf(data, "%ld %ld ", pTT->sec, pTT->usec); 
								write(fd, data, strlen(data)); 
								char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
								time_t timep=pTT->sec; 
								struct tm *ptm;
								ptm = gmtime(&timep); 
								sprintf(data, "%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld\n", 
										1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
										wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, pTT->usec/1000); 
								write(fd, data, strlen(data)); 
							} while(0); 
						}
					}
				}
				pTTPrev=pTT; 
				pTT=pTT->pNext; 
			}
			close(fd); 
		}
		pT=pT->pNext; 
	}
}

#if 0
void test001(void){
	int i=0; 
	struct timeval te; 
	// time_t now=time(NULL); 
	time_t now=1651128422; 
	gettimeofday(&te, NULL); // get current time
	appendCar(&pCarTab, "8200000013A3000000000000"); 
	appendCar(&pCarTab, "8200000013A5000000000000"); 
	appendCar(&pCarTab, "8200000013A5000000000000"); 
	/* 1st loop*/
	appendCarTimestamp("8200000013A3000000000000", now-2, te.tv_usec-20000); 
	appendCarTimestamp("8200000013A3000000000000", now-1, te.tv_usec-10000); 
	for(i=0; i<20; i++){
		appendCarTimestamp("8200000013A3000000000000", now, te.tv_usec+10000*i); 
	}
	appendCarTimestamp("8200000013A3000000000000", now+1, te.tv_usec+10000); 
	appendCarTimestamp("8200000013A3000000000000", now+2, te.tv_usec+20000); 

	appendCarTimestamp("8200000013A5000000000000", now+100, te.tv_usec); 
	/* 1st loop end*/
	/* 2nd loop*/
	now+=120; 
	appendCarTimestamp("8200000013A3000000000000", now-2, te.tv_usec-20000); 
	appendCarTimestamp("8200000013A3000000000000", now-1, te.tv_usec-10000); 
	for(i=0; i<20; i++){
		appendCarTimestamp("8200000013A3000000000000", now, te.tv_usec+10000*i); 
	}
	appendCarTimestamp("8200000013A3000000000000", now+1, te.tv_usec+10000); 
	appendCarTimestamp("8200000013A3000000000000", now+2, te.tv_usec+20000); 
	/* 2nd loop end*/
	dumpCar(); 
}

void test002(void){
	time_t t;
	long lt; 
	lt=time(&t); 
	printf("%ld, %ld\n", lt, t); 
}

void exitFunc(void){
	dbge("exit!!"); 
	cleanCar(&pCarTab); 
}

void signalHandler(int sig){
	if(sig == SIGUSR1){
		// dumpCar(); 
		logCar(); 
		analyzeCar(); 
	}
	if(sig == SIGTERM || sig == SIGINT){
		exit(0); 
	}
}

void setSigExitFunc(void){
	signal(SIGUSR1, signalHandler); 
	signal(SIGTERM, signalHandler); 
	signal(SIGINT, signalHandler); 
	atexit(exitFunc); 
}

int main(void){
	setSigExitFunc(); 
	test001(); 
	test002(); 
	while(1){
		sleep(5); 
	}
	return 0;
}

#endif
