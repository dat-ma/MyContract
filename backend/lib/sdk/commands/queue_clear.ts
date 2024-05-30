import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { QueueConfig } from '../types/queue.js'

export default class QueueClear extends BaseCommand {
  static commandName = 'queue:clear'

  static description = 'Clear the queues'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: false,
  }

  @flags.array({ flagName: 'queue', alias: 'q' })
  declare queues: string[]

  async run() {
    const config = await this.app.container.make('config')
    const queueConfig = config.get('queue') as QueueConfig<any>

    const queues = this.queues ?? Object.keys(queueConfig.queues)

    const queueService = await this.app.container.make('queue')

    await Promise.all(
      queues.map(async (name) => {
        // @ts-ignore
        await queueService.clear(name)

        // @ts-ignore
        const queue = queueService.get(name)
        await queue?.disconnect?.()
      })
    )
  }
}
