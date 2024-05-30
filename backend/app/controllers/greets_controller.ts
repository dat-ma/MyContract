import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Queue } from '@its/sdk/queue'

@inject()
export default class GreetsController {
  @inject()
  async index({ response, bouncer }: HttpContext, queue: Queue) {
    await bouncer.with('GreetPolicy').authorize('index')

    await queue.dispatch(
      '#jobs/greet_job',{},{
        delay: 1000,
      }
    )
    
    response.ok({ message: 'OK' })
  }

  async store({ response, bouncer }: HttpContext) {
    await bouncer.with('GreetPolicy').authorize('store')
    response.ok({ message: 'OK' })
  }
}
