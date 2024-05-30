import { inject } from '@adonisjs/core'
import {
  DataForJob,
  DispatchOptions,
  JobHandlerContract,
  JobName,
  QueueConfig,
  QueueName,
  QueueService,
} from './types.js'
import { ApplicationService, LoggerService } from '@adonisjs/core/types'
import { Job, Queue as BullQueue, Worker } from 'bullmq'
import lodash from 'lodash'

const { get, keys, merge } = lodash

@inject()
export class Queue implements QueueService {
  private queues: Map<string, BullQueue> = new Map()

  constructor(
    private config: QueueConfig<any>,
    private app: ApplicationService,
    private logger: LoggerService
  ) {
    keys(config.queues).forEach((name) => {
      this.queues.set(
        name,
        new BullQueue(name, {
          ...config.queue,
          connection: config.connection,
        })
      )
    })
  }

  async dispatch<K extends JobName>(
    jobName: K,
    payload: DataForJob<K>,
    options: DispatchOptions
  ): Promise<Job<any, any, string> | null> {
    const disabled = get(options, 'disabled', false)

    if (disabled) {
      this.logger.info(`Job ${jobName} is disabled`)
      return null
    }

    const queueName = options.queueName || 'default'

    const job = await this.queues.get(queueName)!.add(jobName, payload, {
      ...this.config.jobs,
      ...options,
    })
    this.logger.info(`Job ${jobName} is dispatched`)
    return job
  }

  async process<Q extends QueueName>(queueName: Q): Promise<this> {
    this.logger.info(`Queue [${queueName || 'default'}] processing started...`)

    let worker = new Worker(
      queueName,
      async (job) => {
        try {
          console.log(this.app.container)
          const { default: Job } = await this.app.import(job.name)
          const jobHandler = (await this.app.container.make(Job, [job])) as JobHandlerContract
          this.logger.info(`Job ${job.name} started`)

          await jobHandler.handle(job.data)
          this.logger.info(`Job ${job.name} finished`)
        } catch (e) {
          console.error(e)
          this.logger.error(`Job handler for ${job.name} not found`)
        }
      },
      {
        // @ts-ignore
        connection: this.config.connection,
        ...this.config.worker,
      }
    )

    worker.on('failed', async (job, error) => {
      this.logger.error(error.message, [])

      // If removeOnFail is set to true in the job options, job instance may be undefined.
      // This can occur if worker maxStalledCount has been reached and the removeOnFail is set to true.
      if (job && (job.attemptsMade === job.opts.attempts || job.finishedOn)) {
        // Call the failed method of the handler class if there is one
        const { default: Job } = await this.app.import(job.name)
        const jobHandler = (await this.app.container.make(Job, [job])) as JobHandlerContract
        if (typeof jobHandler.failed === 'function') await jobHandler.failed()
      }
    })

    return this
  }

  async clear(queueName: QueueName): Promise<void> {
    if (!this.queues.has(queueName)) {
      return this.logger.info(`Queue [${queueName}] doesn't exist`)
    }

    const queue = this.queues.get(queueName || 'default')

    await queue!.obliterate().then(() => {
      this.logger.info(`Queue [${queueName}] cleared`)
    })
  }

  list(): BullQueue[] {
    return Array.from(this.queues.values())
  }

  get<K extends QueueName>(queueName: K): BullQueue | null {
    if (!this.queues.has(queueName)) {
      this.logger.warn(`Queue [${queueName}] doesn't exist`)
      return null
    }

    return this.queues.get(queueName)!
  }

  async removeRepeatable(queues: Array<QueueName>): Promise<void> {
    await Promise.all(
      queues.flatMap(async (name) => {
        const queue = this.get(name)

        if (!queue) {
          return
        }

        return await queue.getRepeatableJobs().then((jobs) =>
          jobs.map((job) => {
            this.logger.info(`Removing repeatable job ${job.key}`)
            return queue.removeRepeatableByKey(job.key)
          })
        )
      })
    )
  }

  async schedule<T extends JobName>(
    job: T,
    payload: DataForJob<T>,
    dispatchOptions: DispatchOptions,
    overrides?:
      | Partial<{
          options: Partial<DispatchOptions>
          disabled: boolean
          payload: any
        }>
      | undefined
  ): Promise<void> {
    dispatchOptions = merge(dispatchOptions, get(overrides, 'options', {}))

    if (dispatchOptions.repeat) {
      await this.dispatch(job, payload, {
        ...dispatchOptions,
        repeat: {
          ...dispatchOptions.repeat,
          // To prevent schedule delaying until next execution
          immediately: false,
        },
      })
    } else {
      await this.dispatch(job, payload, dispatchOptions)
    }
  }
}
