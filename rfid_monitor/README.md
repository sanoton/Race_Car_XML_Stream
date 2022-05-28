# RFID Monitor

## Build

```shell
apt-get update
apt-get install -y build-essential git
git clone https://github.com/hsuehshihwang/rfid_monitor.git
cd rfid_monitor
make
```



## Usage

### Normal mode

```shell
./rfid_monitor --addr 192.168.1.1 --port 5000
```

### Simulation mode

```shell
./rfid_monitor --sim
```




