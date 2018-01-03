import * as types from '../constants/ActionTypes'
import { Service } from '../library/core'

@Service('$todo')
export default class Todo {
  addTodo (text) {
    return { type: types.ADD_TODO, text }
  }

  deleteTodo (id) {
    return { type: types.DELETE_TODO, id }
  }

  editTodo (id, text) {
    return { type: types.EDIT_TODO, id, text }
  }

  completeTodo (id, completed) {
    return { type: types.COMPLETE_TODO, id, completed }
  }

  completeAll () {
    return { type: types.COMPLETE_ALL }
  }

  clearCompleted () {
    return { type: types.CLEAR_COMPLETED }
  }
}
