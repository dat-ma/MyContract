import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { QueueConfig } from '../types/queue.js'

export default class QueueListen extends BaseCommand {
  static commandName = 'queue:listen'

  static description = 'Run the listeners for the queues'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  @flags.array({ flagName: 'queue', alias: 'q' })
  declare queues: string[]

  async run() {
    const config = await this.app.container.make('config')
    const queueConfig = config.get('queue') as QueueConfig<any>

    const router = await this.app.container.make('router')
    router.commit()

    const queues = this.queues ?? Object.keys(queueConfig.queues)

    const queueService = await this.app.container.make('queue')
    // @ts-ignore
    await Promise.all(queues.map((queue) => queueService.process(queue)))
  }
}
