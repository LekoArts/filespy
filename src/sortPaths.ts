// Adapted from https://github.com/hughsk/path-sort
export function sortPaths(as: string, bs: string) {
  const a = as.split('/')
  const b = bs.split('/')
  const l = Math.min(a.length, b.length)
  for (let i = 0; i < l; i += 1) {
    const ac = a[i].toUpperCase()
    const bc = b[i].toUpperCase()
    if (ac > bc)
      return +1
    if (ac < bc)
      return -1
  }
  return a.length - b.length
}
