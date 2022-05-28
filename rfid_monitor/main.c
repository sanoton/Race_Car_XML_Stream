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
#include <getopt.h>
#include "main.h"

// pthread_mutex_t mutex1 = PTHREAD_MUTEX_INITIALIZER;

static int telnet_init=0; 
static int simulation=0; 
static char telnet_addr[64]="192.168.1.1";
static char telnet_port[12]="23"; 

void telnet_func(void){
	int fd=0;
	int lock_fd=0; 
	lock_fd=api_lock("lockf"); 
	if(!access("telnet", F_OK)) remove("telnet"); 
	fd=open("telnet", O_RDWR | O_CREAT, 00644); 
	if(fd == -1) goto err; 
	if(dup2(fd, 1) == -1) goto err;
	dbge("fd(%d)", fd); 
	// if(dup2(fd, 2) == -1) goto err; 
	close(fd); 
	close(0); 
	telnet_init=1; 
	api_unlock(lock_fd); 
	if(simulation){
		while(1){
			sleep(5); 
		}
	}else{
		// SYSTEM("telnet localhost 5000"); 
		// SYSTEM("telnet 192.168.1.1"); 
		SYSTEM("telnet %s %s", telnet_addr, telnet_port); 
	}
err:
	if(fd>0) close(fd); 
}

void fetch_data_func(void){
	int fd=0; 
	char line[128]={0}; 
	char c=0; 
	char *p=line; 
	int lock_fd=0; 
	FILE *logfp; 
	sleep(1);
	lock_fd=api_lock("lockf"); 
	while(1){ if(telnet_init) break; usleep(100000); }
	fd=open("telnet", O_RDONLY); 
	api_unlock(lock_fd); 
	if(!access("telnet.log", F_OK)) remove("telnet.log"); 
	logfp=fopen("telnet.log", "a"); 
	// printf("am i passed?\n");
	dbge("fd(%d)", fd); 
	// printf("am i passed?\n");
	if(fd>0){
		while(1){
			int ret=read(fd, &c, 1); 
			if(ret==1){
				if(c=='\n'||c=='\r'){
					char id[64]={0};
					char ant[8]={0};
					char user[8]={0};
					if(strlen(line)==0){
						line[0]='\0'; 
						continue; 
					}
					sscanf(line, "ID NO:%[^;];ANT NO:%[^;];User Code:%s", id, ant, user);
					// Shorten the ID length to 12 characters. 
					sscanf(id, "%12s", id); 
					// time_t now=time(NULL); 
					// p+=sprintf(p, "%c", c); 
					struct timeval te; 
					char *wday[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
					time_t timep;
					struct tm *ptm;
					time(&timep); /*獲得time_t結構的時間，UTC時間*/
					ptm = gmtime(&timep); /*轉換為struct tm結構的UTC時間*/
#if 0
					printf("%d/%d/%d ", 1900 + p->tm_year, 1 + p->tm_mon, p->tm_mday);
					printf("%s %d:%d:%d/n", wday[p->tm_wday], p->tm_hour,
							p->tm_min, p->tm_sec);
#endif
					gettimeofday(&te, NULL); // get current time
#if 0
					fprintf(stderr, "line(%02d/%02d/%02d %s - %02d:%02d:%02d [%ld,%ld], %s)\n", 
							1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
							wday[ptm->tm_wday], ptm->tm_hour, ptm->tm_min, ptm->tm_sec, 
							te.tv_sec, te.tv_usec, line); 
#endif
					fprintf(stderr, "line(%s)\n%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld [%ld,%ld], id(%s), ant(%s), user(%s)\n", 
							line, 1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
							wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, te.tv_usec/1000, 
							te.tv_sec, te.tv_usec, id, ant, user); 
					fprintf(logfp, "%02d/%02d/%02d %s - %02d:%02d:%02d.%03ld: %s\n", 
							1900 + ptm->tm_year, 1 + ptm->tm_mon, ptm->tm_mday, 
							wday[ptm->tm_wday], ptm->tm_hour+8, ptm->tm_min, ptm->tm_sec, te.tv_usec/1000, 
							line); 
					fflush(stderr); 
					fflush(logfp); 
					if(strlen(id)>0){
						appendCarTimestamp(id, te.tv_sec, te.tv_usec); 
						// dumpCar(); 
					}
					line[0]='\0'; 
					p=line; 
				}else{
					p+=sprintf(p, "%c", c); 
				}
			}else{
				// fprintf(stderr, "no read...\n"); 
				usleep(10); 
			}
		}
		close(fd); 
		fclose(logfp); 
	}
}

void log_data_func(void){
	while(1){
		logCar(); 
		analyzeCar(); 
		sleep(3); 
	}
}

void exitFunc(void){
	dbge("exit!!"); 
	cleanCar(); 
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

void usage_func(char *name){
	char fmt[]="\
Usage: %s [OPTIONS]... \n\
  -s, --sim                  Enable simulation mode. (0: disable, 1: enable) \n\
                             Default: disabled. \n\
  -a, --addr                 Telnet server address. \n\
                             Default: 192.168.1.1 \n\
  -p, --port                 Telnet server port. \n\
                             Default: 23 \n\
  -d, --detect               Detect one loop time. (Unit: second)\n\
                             Default: 5(sec) \n\
  -f, --filter               Filter valid signal interval. (Unit: micro second)\n\
                             Default: 500000(us) \n\
  -t, --times                Filter valid signal times. \n\
                             Default: 5 times \n\
  -h, --help                 Display this help and exit. \n\
"; 
	fprintf(stderr, fmt, name); 
}

int main(int argc, char *argv[]){
	int c;

	while (1) {
		int option_index = 0;
		static struct option long_options[] = {
			{"sim",     no_argument,       0, 's'},
			{"addr",    required_argument, 0, 'a'},
			{"port",    required_argument, 0, 'p'},
			{"detect",  required_argument, 0, 'd'},
			{"filter",  required_argument, 0, 'f'},
			{"times",   required_argument, 0, 't'},
			{"help",    no_argument,       0, 'h'},
			{0,         0,                 0,  0 }
		};

		c = getopt_long(argc, argv, "hsa:p:d:f:",
				long_options, &option_index);
		if (c == -1)
			break;

		switch (c) {
#if 0
			case 0:
				printf("option %s", long_options[option_index].name);
				if (optarg)
					printf(" with arg %s", optarg);
				printf("\n");
				break;
#endif

			case 's':
				simulation = 1; 
				break;

			case 'a':
				strcpy(telnet_addr, optarg); 
				break;

			case 'p':
				strcpy(telnet_port, optarg); 
				break;

			case 'd':
				detect_oneloop_time=atoi(optarg); 
				detect_oneloop_time=(detect_oneloop_time>0?detect_oneloop_time:5); 
				break;

			case 'f':
				filter_valid_time=atoi(optarg); 
				filter_valid_time=(filter_valid_time>0?filter_valid_time:500000); 
				break;

			case 't':
				valid_times=atoi(optarg); 
				valid_times=(valid_times>0?valid_times:5); 
				break;

			case '?':
			case 'h':
				usage_func(argv[0]); 
				exit(0); 
				break;

			default:
				fprintf(stderr, "?? getopt returned character code 0%o ??\n", c);
		}
	}

	pthread_t id;
	setSigExitFunc(); 
	pthread_create(&id, NULL, (void *)&telnet_func, NULL);
	pthread_create(&id, NULL, (void *)&fetch_data_func, NULL);
	pthread_create(&id, NULL, (void *)&log_data_func, NULL);
	while(1){
		sleep(5);
	}
	return 0;
}

