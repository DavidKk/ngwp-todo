import forEach from 'lodash/forEach'

export function annotate (fn) {
  let fnArgsRegex = /^function\s*[^(]*\(\s*([^)]*)\)/m
  let fnArgsSplitRegex = /,/
  let fnArgvRegex = /^\s*(_?)(.+?)\1\s*$/
  let stripCommentsRegex = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
  let fnText = fn.toString().replace(stripCommentsRegex, '')
  let args = fnText.match(fnArgsRegex)
  let $inject = []

  forEach(args[1].split(fnArgsSplitRegex), (argv) => {
    argv.replace(fnArgvRegex, (all, underscore, name) => $inject.push(name))
  })

  return $inject
}
