import angular from 'angular'
import { Home } from 'components/home'
import uiRouter from 'angular-ui-router'
import 'assets/styles/public.scss'

export const Index = 'index'

export default angular.module(Index, [
  uiRouter,
  Home
])
.config(function ($stateProvider, $urlRouterProvider) {
  'ngInject'

  $stateProvider
  .state('home', {
    url: '',
    template: '<home user="$resolve.user"></home>',
    resolve: {
      user ($q) {
        'ngInject'

        let deferred = $q.defer()
        setTimeout(() => deferred.resolve({ name: 'David' }), 10)
        return deferred.promise
      }
    }
  })
})
