import app from '@adonisjs/core/services/app'
import { test } from '@japa/runner'

test.group('Greet job', () => {
  test('Greet job success', async ({ expect }) => {
    const { default: Job } = await import('#jobs/greet_job')
    const job = await app.container.make(Job, [{}])
    expect(() => job.handle({})).not.toThrowError()
  })
})
