import assign from 'lodash/assign'
import isEqual from 'lodash/isEqual'
import { Inject } from './core'

export class Container {
  componentWillReceiveState (nextState) {
    if (!isEqual(this.$state, nextState)) {
      this.$state = assign(this.$state, nextState)
      assign(this, this.$state)
    }
  }

  mapStateToThis (state) {
    return state
  }

  @Inject('$scope')
  setState (value, $scope) {
    assign($scope, value)
  }
}
