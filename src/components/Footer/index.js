import map from 'lodash/map'
import { Inject, Directive } from '../../library/core'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/TodoFilters'
import Template from './template.pug'

const FILTER_TITLES = {
  [SHOW_ALL]: 'All',
  [SHOW_ACTIVE]: 'Active',
  [SHOW_COMPLETED]: 'Completed'
}

@Directive('footer-component', {
  scope: {
    actions: '=actions',
    activeCount: '=activeCount',
    completedCount: '=completedCount',
    onShow: '=onShow'
  },
  template: Template()
})
@Inject('$scope')
export default class Footer {
  constructor ($scope) {
    this.tabs = map([SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED], function (filter) {
      return {
        title: FILTER_TITLES[filter],
        value: filter
      }
    })

    $scope.handleClearComplete = this.clearComplete.bind(this)
  }

  @Inject('$scope')
  clearComplete ($scope) {
    $scope.actions.clearCompleted()
  }
}
