import User from '#models/user'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class GreetPolicy extends BasePolicy {
  index(_user: User): AuthorizerResponse {
    return true
  }

  store(_user: User): AuthorizerResponse {
    return false
  }
}
