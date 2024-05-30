import { inject } from '@adonisjs/core'
import { Logger } from '@adonisjs/core/logger'
import type { JobHandlerContract, Job } from '@its/sdk/types/queue'

export type GreetJobPayload = {}

@inject()
export default class implements JobHandlerContract<GreetJobPayload> {
  constructor(
    public job: Job,
    private logger: Logger
  ) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  async handle(_payload: GreetJobPayload) {
    this.logger.info('Hello')
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed() {
    this.logger.error('Sorry')
  }
}

declare module '@its/sdk/types/queue' {
  export interface JobList {
    '#jobs/greet_job': GreetJobPayload
  }
}
