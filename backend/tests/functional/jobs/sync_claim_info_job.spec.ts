import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Test schedule job', () => {
  test('Test schedule job success', async ({ expect }) => {
    const { default: Job } = await import('#jobs/sync_claim_infor_job')
    const job = await app.container.make(Job, [{}])
    expect(() => job.handle({})).not.toThrowError()
  })
})