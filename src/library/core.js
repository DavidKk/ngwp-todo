import map from 'lodash/map'
import uniq from 'lodash/uniq'
import assign from 'lodash/assign'
import indexOf from 'lodash/indexOf'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import angular from 'angular'
import shortid from 'shortid'
import { annotate } from '../share/utils'

export function Inject (...dependencies) {
  return function (Module, key, descriptor) {
    if (isFunction(Module)) {
      let $inject = Module.$inject || []
      $inject = $inject.concat(dependencies)
      $inject = uniq($inject)

      return $inject.concat((...allDependencies) => {
        let fnDeps = inject(dependencies, $inject, allDependencies)

        class AngularModule extends Module {
          static $inject = $inject
          static $dependencies = allDependencies
        }

        return new AngularModule(...fnDeps)
      })
    }

    let fn = descriptor.value
    if (key === '$get') {
      let newFn = dependencies.concat(fn)
      newFn.$inject = dependencies
      descriptor.value = newFn
      return descriptor
    }

    let $inject = Module.constructor.$inject || []
    $inject = $inject.concat(dependencies)
    $inject = uniq($inject)
    Module.constructor.$inject = $inject

    let newFn = function (...args) {
      let fnArgs = annotate(fn)
      let fnDeps = inject(dependencies, this.constructor.$inject, this.constructor.$dependencies)
      args = assign(new Array(fnArgs.length - fnDeps.length), args)
      return fn.call(this, ...args, ...fnDeps)
    }

    newFn.$inject = dependencies
    descriptor.value = newFn
    return descriptor
  }
}

export function Module (moduleName, dependencies) {
  if (!isString(moduleName)) {
    throw new Error('Module name is not a string or not provided')
  }

  return function (Module) {
    return angular
    .module(moduleName, dependencies || [])
    .run(isFunction(Module) ? wrap(Module) : Module)
    .name
  }
}

export function Config (dependencies) {
  return function (Module) {
    let moduleName = shortid.generate()

    return angular
    .module(moduleName, dependencies || [])
    .config(isFunction(Module) ? wrap(Module) : Module)
    .name
  }
}

export function Provider (name, dependencies) {
  if (!isString(name)) {
    throw new Error('Name is not a string or not provided')
  }

  return function (Module) {
    let moduleName = shortid.generate()
    if (isArray(Module)) {
      Module = Module.unshift()
    }

    let $inject = Module.$inject || []
    let $getInject = Module.prototype.$get.$inject || []
    let Provider = $inject.concat((...allDependencies) => {
      class AngularModule extends Module {
        static $inject = $inject
        static $dependencies = allDependencies
        $get = $getInject.concat(Module.prototype.$get)
      }

      return new AngularModule()
    })

    return angular
    .module(moduleName, dependencies || [])
    .provider(name, Provider)
    .name
  }
}

export function Factory (name, dependencies) {
  if (!isString(name)) {
    throw new Error('Name is not a string or not provided')
  }

  return function (Module) {
    let moduleName = shortid.generate()

    return angular
    .module(moduleName, dependencies || [])
    .factory(name, isFunction(Module) ? wrap(Module) : Module)
    .name
  }
}

export function Service (name, dependencies) {
  if (!isString(name)) {
    throw new Error('Name is not a string or not provided')
  }

  return function (Module) {
    let moduleName = shortid.generate()

    return angular
    .module(moduleName, dependencies || [])
    .service(name, isFunction(Module) ? wrap(Module) : Module)
    .name
  }
}

export function Filter (name, dependencies) {
  if (!isString(name)) {
    throw new Error('Name is not a string or not provided')
  }

  return function (Module) {
    let moduleName = shortid.generate()

    return angular
    .module(moduleName, dependencies || [])
    .filter(name, isFunction(Module) ? wrap(Module) : Module)
    .name
  }
}

export function Directive (selector, module = {}, dependencies) {
  if (isObject(module) && !isArray(module)) {
    let component = [() => module]
    return Directive(selector, component, dependencies)
  }

  selector = selector.replace(/(-[a-z])/g, ($1) => $1.substr(1).toUpperCase())
  selector = selector.charAt(0).toLowerCase() + selector.substr(1)

  return function (Directive) {
    let moduleName = shortid.generate()
    let fn = module.pop()

    let component = function (...args) {
      let options = fn(...args)

      return defaults(options, {
        replace: true,
        restrict: 'EA',
        controllerAs: '$ctrl',
        controller: Directive
      })
    }

    module.push(component)

    return angular
    .module(moduleName, dependencies || [])
    .directive(selector, module)
    .name
  }
}

function wrap (Module) {
  let $inject = Module.$inject || []
  return $inject.concat((...allDependencies) => {
    class AngularModule extends Module {
      static $inject = $inject
      static $dependencies = allDependencies
    }

    return new AngularModule()
  })
}

function inject (requires, names, dependencies) {
  return map(requires, (name) => {
    let index = indexOf(names, name)
    if (index === -1) {
      throw new Error(`${name} is not found`)
    }

    return dependencies[index]
  })
}
