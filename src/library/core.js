import map from 'lodash/map'
import uniq from 'lodash/uniq'
import indexOf from 'lodash/indexOf'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import defaults from 'lodash/defaults'
import angular from 'angular'
import shortid from 'shortid'

export function Inject (...dependencies) {
  return function (Module, key, descriptor) {
    if (isFunction(Module)) {
      let $inject = Module.$inject || []
      $inject = $inject.concat(dependencies)
      $inject = uniq($inject)

      let Wrapper = (...allDependencies) => {
        let fnDeps = inject(dependencies, $inject, allDependencies)

        class AngularModule extends Module {
          static $inject = $inject
          static $dependencies = allDependencies
        }

        return new AngularModule(...fnDeps)
      }

      let moduleName = camelModuleName(Module)
      Wrapper.$name = moduleName

      return $inject.concat(Wrapper)
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
      let constructor = this.constructor
      let fnDeps = inject(dependencies, constructor.$inject, constructor.$dependencies)
      return fn.call(this, ...fnDeps, ...args)
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
    let moduleName = camelModuleName(Module)

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
    let moduleName = camelModuleName(Module)
    if (isArray(Module)) {
      Module = Module.unshift()
    }

    let $inject = Module.$inject || []
    let $getModule = Module.$get || Module.prototype.$get || function () {}
    let $getInject = $getModule.$inject || []

    let Provider = $inject.concat((...allDependencies) => {
      class AngularModule extends Module {
        static $name = moduleName
        static $inject = $inject
        static $dependencies = allDependencies
        static toString = () => AngularModule.$name
        $get = isArray($getModule) ? $getModule : $getInject.concat(wrap($getModule))
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
    let moduleName = camelModuleName(Module)

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
    let moduleName = camelModuleName(Module)

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
    let moduleName = camelModuleName(Module)

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
    let moduleName = camelModuleName(Directive)
    let fn = module.pop()

    let component = function (...args) {
      let options = fn(...args)

      /**
       * scope 为 false
       * 为导致 controllerAs 继承父中的 scope 属性
       * 默认创建一个新的 scope
       */
      options = defaults(options, {
        replace: true,
        scope: true,
        restrict: 'EA',
        controllerAs: '$ctrl',
        controller: isFunction(Directive) ? Inject()(Directive) : Directive
      })

      let noConflit = options.link
      options.link = function ($scope, $element, $attrs, $ctrl) {
        let ctrlName = options.controllerAs || '$ctrl'
        $scope[ctrlName] = $ctrl

        if (isFunction(noConflit)) {
          return noConflit.apply(this, arguments)
        }
      }

      return options
    }

    module.push(component)

    return angular
      .module(moduleName, dependencies || [])
      .directive(selector, module)
      .name
  }
}

function wrap (Module) {
  let moduleName = camelModuleName(Module)
  let $inject = Module.$inject || []

  let Wrapper = (...allDependencies) => {
    class AngularModule extends Module {
      static $inject = $inject
      static $dependencies = allDependencies
    }

    return new AngularModule()
  }

  Wrapper.$name = moduleName

  return $inject.concat(Wrapper)
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

function camelModuleName (Module) {
  if (process.env.production) {
    return shortid.generate()
  }

  if (isArray(Module)) {
    Module = Module.slice(-1)
    Module = Module[0]
  }

  let name = Module.$name || Module.name || '_default'
  if (name === '_default') {
    return shortid.generate()
  }

  return name.substr(0, 1).toUpperCase() + name.substr(1) + '_' + shortid.generate()
}
