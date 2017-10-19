import { Directive } from '../../library/core'
import TodoTextInput from '../TodoTextInput'
import Template from './template.pug'

@Directive('header-component', {
  scope: {
    addTodo: '=?addTodo'
  },
  template: Template()
}, [
  TodoTextInput
])
export default class Header {}
