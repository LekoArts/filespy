# filespy

This is a fork of [alloc/filespy](https://github.com/alloc/filespy) to keep dependencies up-to-date and do the occasional fix. This package is **ESM only**.

> Spy on files

## Features

- Emits files only
- Crawls **asynchronously** before watching
- Powered by `@parcel/watcher` for native performance, event throttling, and [Watchman](https://facebook.github.io/watchman/) support
- Tolerates permission errors
- Has powerful [pattern syntax](#pattern-syntax)
- Handles renamed directories properly
- Exposes the paths being watched
- Exposes the paths that were skipped
- Ensures file paths use forward slashes
- Protects against reentrancy by using `setImmediate` before emitting
- Splits up long-running listeners with `setImmediate`
- Crashes if you don't handle `error` events
- Waits for root directory to exist

## Usage

```ts
import { filespy } from '@lekoarts/filespy'

const spy = filespy(process.cwd(), {
  only: ['*.[jt]sx?'],
  skip: ['node_modules'],
}).on('all', (event, file, stats, cwd) => {
  // "file" argument is relative to "cwd"
  // "stats" is from lstat call

  if (event === 'create') {
    // File created.
  }
  else if (event === 'update') {
    // File changed.
  }
  else {
    // File deleted.
  }
}).on('error', (error) => {
  // Permission error or watcher failed.
  console.error(error)
}).on('ready', () => {
  // Initial crawl completed. Watcher initialized.
})

spy.dirs // Set of watched directories.
spy.files // Sorted list of watched paths (even directories).
spy.skipped // Sorted list of existing paths that were skipped.

// List all watched paths within a watched directory.
// Returned paths are relative to cwd.
spy.list('foo/bar')

// Stop watching.
spy.close()
```

## Events

```ts
interface Events {
  all(
    event: 'create' | 'update' | 'delete',
    /** Path relative to cwd */
    file: string,
    /** Equals null for "delete" events */
    stats: fs.Stats | null, // https://nodejs.org/api/fs.html#fs_class_fs_stats
    /** The root directory */
    cwd: string
  ): void

  /** Permission error or watcher failure */
  error(error: Error): void

  /** Directory was crawled */
  crawl(dir: string, cwd: string): void

  /** Watcher is ready */
  ready(): void

  /** File created */
  create(file: string, stats: fs.Stats, cwd: string): void

  /** File changed */
  update(file: string, stats: fs.Stats, cwd: string): void

  /** File deleted */
  delete(file: string, cwd: string): void
}
```

## Pattern syntax

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
