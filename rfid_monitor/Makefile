
all: clean rfid_monitor

rfid_monitor: 
	$(CC) -Wall -o $@ main.c utility.c car.c -lpthread

clean: 
	@rm -rf rfid_monitor *.[oadsi]
