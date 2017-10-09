/* eslint max-nested-acllbacks: off */
/* eslint no-unused-expressions: off */
/* eslint-env mocha */
/* global expect */

import angular from 'angular'
import 'angular-mocks'
import Index from 'modules/index/index.js'

const { module, inject } = angular.mock

describe('Index Module', function () {
  let $componentController

  beforeEach(module(Index.name))

  beforeEach(inject((_$componentController_) => {
    $componentController = _$componentController_
  }))

  it('should call the `onDelete` binding, when deleting the hero', function () {
    let bindings = { user: { name: 'david' } }
    let ctrl = $componentController('home', null, bindings)
    expect(ctrl.user.name).to.equal('david')
  })
})
