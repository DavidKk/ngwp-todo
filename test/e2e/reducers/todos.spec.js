import { expect } from 'chai'
import todos from 'reducers/todos'
import * as types from 'constants/ActionTypes'

describe('todos reducer', () => {
  it('should handle initial state', () => {
    let prevState = todos(undefined, {})
    let nextState = [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle ADD_TODO', () => {
    let prevState = todos([], {
      type: types.ADD_TODO,
      text: 'Run the tests'
    })

    let nextState = [
      {
        text: 'Run the tests',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)

    prevState = todos([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ], {
      type: types.ADD_TODO,
      text: 'Run the tests'
    })

    nextState = [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    ]

    expect(prevState).to.deep.equal(nextState)

    prevState = todos([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }, {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    ], {
      type: types.ADD_TODO,
      text: 'Fix the tests'
    })

    nextState = [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      },
      {
        text: 'Fix the tests',
        completed: false,
        id: 2
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle DELETE_TODO', () => {
    let prevState = todos([
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      },
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }
    ], {
      type: types.DELETE_TODO,
      id: 1
    })

    let nextState = [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle EDIT_TODO', () => {
    let prevState = todos([
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ], {
      type: types.EDIT_TODO,
      text: 'Fix the tests',
      id: 1
    })

    let nextState = [
      {
        text: 'Fix the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle COMPLETE_TODO', () => {
    let prevState = todos([
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ], {
      type: types.COMPLETE_TODO,
      completed: true,
      id: 1
    })

    let nextState = [
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle COMPLETE_ALL', () => {
    let prevState = todos([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ], {
      type: types.COMPLETE_ALL
    })

    let nextState = [
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: true,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)

    // Unmark if all todos are currently completed

    prevState = todos([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: true,
        id: 0
      }
    ], {
      type: types.COMPLETE_ALL
    })

    nextState = [
      {
        text: 'Run the tests',
        completed: false,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should handle CLEAR_COMPLETED', () => {
    let prevState = todos([
      {
        text: 'Run the tests',
        completed: true,
        id: 1
      }, {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ], {
      type: types.CLEAR_COMPLETED
    })

    let nextState = [
      {
        text: 'Use Redux',
        completed: false,
        id: 0
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })

  it('should not generate duplicate ids after CLEAR_COMPLETED', () => {
    let prevState = [
      {
        type: types.COMPLETE_TODO,
        id: 0
      }, {
        type: types.CLEAR_COMPLETED
      }, {
        type: types.ADD_TODO,
        text: 'Write more tests'
      }
    ].reduce(todos, [
      {
        id: 0,
        completed: false,
        text: 'Use Redux'
      }, {
        id: 1,
        completed: false,
        text: 'Write tests'
      }
    ])

    let nextState = [
      {
        text: 'Write tests',
        completed: false,
        id: 1
      }, {
        text: 'Write more tests',
        completed: false,
        id: 2
      }
    ]

    expect(prevState).to.deep.equal(nextState)
  })
})
