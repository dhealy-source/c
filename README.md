# c

A minimal C17 project. Requires a C compiler and GNU Make.

```sh
make          # Build build/hello
make run      # Print Hello, world!
make test     # Check the program's output
make clean    # Remove build outputs
```

Override compiler options as needed, for example:

```sh
make clean
make CFLAGS='-std=c17 -Wall -Wextra -Wpedantic -g -O0'
```

No external dependencies, services, or credentials are required to build and run.
