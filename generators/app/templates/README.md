# <%= name %>

This is a Minecraft plugin written for the Scriptcraft Modular Architecture.

## Building

-   Install the TypeScript compiler:

```bash
npm i -g typescript
```

-   Start the TypeScript compiler:

```bash
tsc
```

To start the compiler in watch mode (recompile on file save):

```bash
tsc -w
```

## Running a development server

You can start a development server and test your code using `smac` - the Scriptcraft Modular Architecture.

-   Make sure you have Docker installed on your computer.
-   Install `smac` globally:

```bash
npm i -g smac
```

Your plugin contains server profiles for both a Bukkit server (supports the Java Minecraft client) and a Nukkit server (supports Minecraft Pocket Edition).

## Start a Bukkit Server

-   To start a Bukkit development server:

```bash
smac start
```

This uses the profile in `smac.json`.

## Start a Nukkit Server

-   To start a Nukkit development server:

```bash
smac start -f smac-nukkit.json
```

This uses the profile in `smac-nukkit.json`

## Reloading your code

As you change your code, you can reload the changes in the running server by typing in the server console:

```
ts refresh()
```

To switch on TypeScript mode, type in the server console:

```
ts on
```

This allows you to execute TypeScript code directly in the server console. Now you need only type `refresh()` to refresh your code in the server.

To turn off TypeScript mode, type:

```
ts off
```

## Running Unit Tests

SMA Plugins provide unit testing using Jasmine.

To run unit tests for your plugins, write them in `__tests__` and compile them.

Then run smac in test mode:

```bash
smac start -t
```

This will start the container in test mode. Code will not be autoloaded, and the unit tests will be run.

To have the container exit after the tests have run, start it with the `-e` flag.

```bash
# Run tests and exit
smac start -t -e
```

The process will exit with exit code 0 if all tests pass, and exit code 1 if any of the test fail.
