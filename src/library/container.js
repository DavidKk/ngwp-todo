import assign from 'lodash/assign'
import ngRedux from 'ng-redux'
import { Inject } from './core'

export class Container {
  static $inejct = [ngRedux]

  constructor () {
    this.$state = {}
  }

  @Inject('$scope', '$ngRedux')
  connect ($scope, $ngRedux, mapStateToThis = this.mapStateToThis, actions = {}) {
    if (arguments.length === 3) {
      return this.connect(this.mapStateToThis, mapStateToThis)
    }

    let unsubscribe = $ngRedux.connect(mapStateToThis, actions)((nextState, actions) => {
      assign(this, actions)
      this.componentWillReceiveState(nextState)
    })

    $scope.$on('$destroy', unsubscribe)
  }

  mapStateToThis (state) {
    return state
  }

  componentWillReceiveState (nextState) {
    assign(this.$state, nextState)
  }

  @Inject('$stateParams')
  goback ($stateParams) {
    let redirectUrl = $stateParams.dt ? decodeURIComponent($stateParams.dt) : ''
    if (redirectUrl) {
      window.location.replace(redirectUrl)
    } else if (window.history.length > 0) {
      window.history.back()
    }
  }
}
