import angular from 'angular'
import Template from './index.pug'
import './index.scss'

export const Home = 'home'

export default angular.module(Home, [])
.component('home', {
  template: Template(),
  bindings: {
    user: '<'
  }
})
