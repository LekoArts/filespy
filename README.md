# filespy

[![npm](https://img.shields.io/npm/v/filespy.svg)](https://www.npmjs.com/package/filespy)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

> Spy on files

&nbsp;

### Features

- Emits files only
- Crawls **asynchronously** before watching
- Powered by `@parcel/watcher` for native performance, event throttling, and [Watchman](https://facebook.github.io/watchman/) support
- Tolerates permission errors
- Has powerful [pattern syntax](#pattern-syntax)
- Handles renamed directories properly
- Exposes the paths being watched
- Exposes the paths that were skipped
- Ensures file paths use forward slashes

&nbsp;

### Usage

```ts
import filespy from 'filespy'

const spy = filespy(process.cwd(), {
  only: ['*.[jt]sx?'],
  skip: ['node_modules'],
}).on('all', (event, file, stats, cwd) => {
  // "file" argument is relative to "cwd"
  // "stats" is from lstat call

  if (event == 'create') {
    // File created.
  } else if (event == 'update') {
    // File changed.
  } else {
    // File deleted.
  }
}).on('error', error => {
  // Permission error or watcher failed.
}).on('ready', () => {
  // Initial crawl completed. Watcher initialized.
})

spy.dirs // Set of watched directories.
spy.files // Sorted list of watched paths (even directories).
spy.skipped // Sorted list of existing paths that were skipped.

// Stop watching.
spy.close()
```

### Events

- `all` event
  - `event`: "create", "update", or "delete"
  - `file`: path relative to `cwd`
  - `stats`: the [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats) object returned by `lstat`
  - `cwd`: the root directory

- `error` event
  - `error`: an `Error` object
    - `.code`: equals `EACCES` for permission errors

- `ready` event
  - no arguments

- `create` event
  - `file`
  - `stats`
  - `cwd`

- `update` event
  - `file`
  - `stats`
  - `cwd`

- `delete` event
  - `file`
  - `cwd`

### Pattern syntax

Filespy mixes globbing with regular expressions, a concept borrowed from [Recrawl](https://github.com/aleclarson/recrawl).

1. When a path has no separators (`/`), only the basename is matched.

```js
'*.js' // matches 'a.js' and 'a/b.js'
```

2. Recursivity is implicit.

```js
'a/b' // identical to '**/a/b'
```

3. Use a leading separator to match against the root.

```js
'/*.js' // matches 'a.js' not 'a/b.js'
```

4. Use a trailing separator to match all descendants.

```js
'foo/' // matches 'foo/bar' and 'foo/bar/baz' etc
```

5. Regular expression syntax is supported. (except dot-all)

```js
'*.jsx?' // matches 'a.js' and 'b.jsx'
'*.(js|ts)' // matches 'a.js' and 'b.ts'
```

6. Recursive globbing is supported.

```js
'foo/**/bar' // matches 'foo/bar' and 'foo/a/b/c/bar' etc
```
