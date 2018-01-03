import trim from 'lodash/trim'
import { Inject, Directive } from '../../library/core'
import Template from './template.pug'

@Directive('todo-text-input', {
  template: Template(),
  scope: {
    text: '=?text',
    onSave: '=onSave'
  },
  link ($scope, $element, $attrs, $ctrl) {
    let mode = $attrs.hasOwnProperty('mode') ? $attrs.mode : null
    mode && $ctrl.setMode(mode)
  }
})
@Inject('$scope')
export default class Header {
  constructor ($scope) {
    this.mode = 'new'

    $scope.text = $scope.text || ''

    $scope.handleSubmit = (event) => {
      event.keyCode === 13 && this.save($scope.text)
    }

    $scope.handleBlur = () => {
      !this.newTodo && trim($scope.text) && this.save($scope.text)
    }
  }

  setMode (mode) {
    this.mode = mode
  }

  @Inject('$scope')
  save ($scope, text) {
    $scope.onSave(text)

    if (this.mode === 'new') {
      $scope.text = ''
    }
  }
}
