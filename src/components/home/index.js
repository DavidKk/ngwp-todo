import angular from 'angular'
import Template from './index.pug'
import './index.scss'

export const Name = 'home'

export default angular.module(Name, [])
.component('home', {
  template: Template(),
  bindings: {
    user: '<'
  }
})
