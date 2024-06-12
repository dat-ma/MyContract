import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Sync bid info job', () => {
  test('Sync bid info job success', async ({ expect }) => {
    const { default: Job } = await import('#jobs/sync_bid_info_job')
    const job = await app.container.make(Job, [{}])
    expect(() => job.handle({})).not.toThrowError()
  })
})