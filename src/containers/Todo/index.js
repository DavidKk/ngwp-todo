import assign from 'lodash/assign'
import isEqual from 'lodash/isEqual'
import ngRedux from 'ng-redux'
import { Inject, Directive } from '../../library/core'
import { Container } from '../../library/container'
import TodoActions from '../../actions/todo'
import Header from '../../components/Header'
import MainSection from '../../components/MainSection'
import Template from './template.pug'

@Directive('todo-container', {
  template: Template()
}, [
  ngRedux,
  TodoActions,
  Header,
  MainSection
])
@Inject('$scope', '$ngRedux', '$todo')
export default class TodoContainer extends Container {
  constructor ($scope, $ngRedux, $todo) {
    super()

    this.actions = {}

    const actions = {
      addTodo: $todo.addTodo.bind($todo),
      deleteTodo: $todo.deleteTodo.bind($todo),
      editTodo: $todo.editTodo.bind($todo),
      completeTodo: $todo.completeTodo.bind($todo),
      completeAll: $todo.completeAll.bind($todo),
      clearCompleted: $todo.clearCompleted.bind($todo)
    }

    let unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)((nextState, actions) => {
      this.actions = actions
      this.componentWillReceiveState(nextState)
    })

    $scope.$on('$destroy', unsubscribe)
  }

  @Inject('$scope')
  componentWillReceiveState (nextState, $scope) {
    $scope.todos = nextState.todos
  }
}
