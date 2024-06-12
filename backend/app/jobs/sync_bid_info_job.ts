import type { JobHandlerContract, Job } from '@its/sdk/types/queue'

export type sync_bid_infoJobPayload = {}

export default class implements JobHandlerContract<sync_bid_infoJobPayload> {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  async handle(payload: sync_bid_infoJobPayload) {
    
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed() {}
}

declare module '@its/sdk/types/queue' {
  export interface JobList {
    '#jobs/sync_bid_info_job': sync_bid_infoJobPayload
  }
}