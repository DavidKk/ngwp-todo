// eslint-disable-next-line no-unused-vars
import angular from 'angular'
import uiRouter from 'angular-ui-router'
import ngRedux from 'ng-redux'
import ReduxThunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Inject, Module, Config } from '../../library/core'
import Reducers from '../../reducers'
import TodoContainer from '../../containers/Todo'

@Config([
  uiRouter,
  ngRedux,
  TodoContainer
])
@Inject('$ngReduxProvider', '$stateProvider')
class IndexConfig {
  constructor ($ngReduxProvider, $stateProvider) {
    this.mapRedux()
    this.setRouter()
  }

  @Inject('$ngReduxProvider')
  mapRedux ($ngReduxProvider) {
    let middleware = [ReduxThunk]
    if (process.env.development) {
      middleware = middleware.concat(createLogger())
    }

    $ngReduxProvider.createStoreWith(Reducers, middleware)
  }

  @Inject('$stateProvider')
  setRouter ($stateProvider) {
    $stateProvider
    .state('todo', {
      url: '',
      template: '<todo-container></todo-container>'
    })
  }
}

@Module('index', [
  IndexConfig
])
export default class {}
