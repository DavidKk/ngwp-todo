import { Inject, Directive } from '../../library/core'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../../constants/TodoFilters'
import TodoTextInput from '../TodoTextInput'
import Template from './template.pug'

@Directive('header-component', {
  scope: {
    addTodo: '=?addTodo'
  },
  template: Template(),
}, [
  TodoTextInput
])
export default class Header {}
