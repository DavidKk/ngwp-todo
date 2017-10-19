import { Inject, Directive } from '../../library/core'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/TodoFilters'
import TodoItem from '../TodoItem'
import Footer from '../Footer'
import Template from './template.pug'

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
}

@Directive('main-section', {
  scope: {
    todos: '=todos',
    actions: '=actions'
  },
  template: Template()
}, [
  TodoItem,
  Footer
])
@Inject('$scope')
export default class MainSection {
  constructor ($scope) {
    this.filter = SHOW_ALL
    this.todos = $scope.todos

    $scope.handleFilter = this.show.bind(this)

    $scope.$watch(({ todos }) => JSON.stringify(todos), () => {
      this.todos = $scope.todos
      this.completedCount = $scope.todos.reduce((count, todo) => todo.completed ? count + 1 : count, 0)
      this.activeCount = $scope.todos.length - this.completedCount
    })

    $scope.$watch('$ctrl.filter', (filter) => {
      this.todos = $scope.todos.filter(TODO_FILTERS[filter])
    })
  }

  show (filter) {
    this.filter = filter
  }
}
