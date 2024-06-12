import type { ApplicationService } from '@adonisjs/core/types'
import parseDuration from 'parse-duration';

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    const queue = await this.app.container.make('queue');
    await queue.schedule(
      '#jobs/sync_claim_infor_job',
      {
        input1: '20cm',
        input2: parseDuration('30 minutes'),
      },
      {
        repeat: {
          pattern: '* * * * *',
        },
      },
    );
    await queue.schedule(
      '#jobs/sync_bid_info_job',
      {
        input1: '20cm',
        input2: parseDuration('30 minutes'),
      },
      {
        repeat: {
          pattern: '* * * * *',
        },
      },
    )
  }

  async start() {}

  async ready() {}

  async shutdown() {}
}
