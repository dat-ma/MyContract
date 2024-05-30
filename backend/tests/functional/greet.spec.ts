import { test } from '@japa/runner'

test.group('Greet', () => {
  test('example test', async ({ expect, client }) => {
    const response = await client.get('/greet')
    expect(response).toHaveHttpStatusSuccess()
  })
})
