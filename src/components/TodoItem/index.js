import { Inject, Directive } from '../../library/core'
import Template from './template.pug'

@Directive('todo-item', {
  scope: {
    todo: '=todo',
    actions: '=actions'
  },
  template: Template()
})
@Inject('$scope')
export default class TodoItem {
  constructor ($scope) {
    this.editing = false

    $scope.handleSubmit = this.submit.bind(this)
    $scope.handleEdit = this.edit.bind(this)
    $scope.handleComplete = this.complete.bind(this)
  }

  @Inject('$scope')
  complete (isCompleted, $scope) {
    $scope.actions.completeTodo($scope.todo.id, isCompleted)
  }

  edit (isOpen = true) {
    this.editing = !!isOpen
  }

  @Inject('$scope')
  submit (text, $scope) {
    text.length === 0
    ? $scope.actions.deleteTodo($scope.todo.id)
    : $scope.actions.editTodo($scope.todo.id, text)

    this.edit(false)
  }
}
