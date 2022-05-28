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

#include "utility.h"

int SYSTEM(const char *format, ...)
{
	char buf[512]={0};
	va_list arg;
	int ret = 0;

	va_start(arg, format);
	vsnprintf(buf, 512, format, arg);
	va_end(arg);

	ret = system(buf);
	usleep(1);
	return ret;
}

int api_lock(char * filename){
	int fd=0; 
	int ret=0; 
	if(access(filename, F_OK|R_OK)!=0){
		if((fd=open(filename, O_CREAT, 0666))==-1){ 
			ret = -1; 
			goto err; 
		}
		close(fd); 
	}
	if((fd=open(filename, O_RDWR, 0666))==-1){ 
		ret = -2; 
		goto err; 
	}
#ifdef API_LOCK_TEST
	fprintf(stderr, "before lock\n"); 
#endif
	if((lockf(fd, F_LOCK, 0))!=0){ 
		ret = -3; 
		close(fd);
		goto err; 
	}
#ifdef API_LOCK_TEST
	fprintf(stderr, "after lock, then delay 10(s)...\n"); 
	sleep(10); 
#endif
	return fd; 
err: 
	fprintf(stderr, "%s, %d: err, ret %d\n", __FUNCTION__, __LINE__, ret); 
	return -1; 
}

int api_unlock(int fd){
	if(lockf(fd, F_ULOCK, 0)!=0) goto err; 
	close(fd);
	return 0; 
err: 
	fprintf(stderr, "%s, %d: err\n", __FUNCTION__, __LINE__); 
	return -1; 
}

