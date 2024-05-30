import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import lodash from 'lodash'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { Queue } from 'bullmq'
import { ExpressAdapter } from '@bull-board/express'
import express from 'express'
import { createBullBoard } from '@bull-board/api'
import { Server } from 'node:http'
import { QueueConfig } from '../types/queue.js'

const { keys } = lodash

export default class QueueDashboard extends BaseCommand {
  static commandName = 'queue:dashboard'

  static description = 'Run the BullBoard dashboard for the queues'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  @flags.array({ flagName: 'queue', alias: 'q', required: false })
  declare names: string[]

  @flags.string({ flagName: 'root', default: '/queue/dashboard', alias: 'r' })
  declare basePath: string

  @flags.number({ flagName: 'port', default: 9999, alias: ['p'] })
  declare port: number

  declare server: Server

  async run() {
    const config = await this.app.container.make('config')
    const queueConfig = config.get('queue') as QueueConfig<any>

    const queueNames = this.names ?? keys(queueConfig.queues)

    const queues = queueNames.map((queue) => {
      return new BullMQAdapter(new Queue(queue, { connection: queueConfig.connection }))
    })

    const serverAdapter = new ExpressAdapter()
    serverAdapter.setBasePath(this.basePath)

    createBullBoard({
      queues,
      serverAdapter: serverAdapter,
    })

    const app = express()
    app.use(this.basePath, serverAdapter.getRouter())
    this.server = app.listen(this.port, () => {
      this.logger.info(`BullBoard is available at ${this.port} with ${queueNames.join(', ')}`)
    })
  }
}
