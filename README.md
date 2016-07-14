zgit
===========

[![npm](https://badge.fury.io/js/zgit.svg)](http://badge.fury.io/js/zgit)

A command line tool make extra to git

## Feature

+  **`zgit checkout -r`** make zgit can checkout from remote branch and create an new local branch and then alias it
+  **`zgit checkout -l`** make zgit can checkout from local branch and create an new local branch and then alias it
+  **`zgit branch -r` make zgit can list remote  `✔`

## Documentation

### Installation

``` shell
npm install -g zgit
# or
cnpm install -g zgit
```

### Examples (Run it and see it)
``` shell
## list local branches with alias
zgit branch //list

## alias current local branch
zgit alias

## checkout one of local branches by select list
zgit checkout
```