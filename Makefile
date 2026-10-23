CC = cc
CFLAGS = -std=c17 -Wall -Wextra -Wpedantic -O2
TARGET = build/hello

.PHONY: all run test clean

all: $(TARGET)

$(TARGET): main.c Makefile
	mkdir -p build
	$(CC) $(CPPFLAGS) $(CFLAGS) main.c $(LDFLAGS) $(LDLIBS) -o $@

run: $(TARGET)
	./$(TARGET)

test: $(TARGET)
	test "$$(./$(TARGET))" = "Hello, world!"

clean:
	rm -rf build
