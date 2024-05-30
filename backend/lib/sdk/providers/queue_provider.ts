import { Queue } from '../src/queue/queue.js'
import type { ApplicationService } from '@adonisjs/core/types'
import { QueueService } from '../types/queue.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    queue: QueueService
  }
}

export default class QueueProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(Queue, async (resolver) => {
      const config = await resolver.make('config')
      const app = await resolver.make('app')
      const logger = await resolver.make('logger')

      return new Queue(config.get('queue'), app, logger)
    })

    this.app.container.alias('queue', Queue)
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
