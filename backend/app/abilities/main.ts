import User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const greet = Bouncer.ability((_user: User) => {
  return false
})
