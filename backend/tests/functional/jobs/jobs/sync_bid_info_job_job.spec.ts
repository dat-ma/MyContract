import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Jobs sync bid info job job', () => {
  test('Jobs sync bid info job job success', async ({ expect }) => {
    const { default: Job } = await import('#jobs/jobs_sync_bid_info_job_job')
    const job = await app.container.make(Job, [{}])
    expect(() => job.handle({})).not.toThrowError()
  })
})