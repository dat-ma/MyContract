import type { HttpContext } from '@adonisjs/core/http'

export default class HealthController {
  async index({ response }: HttpContext) {
    // Health check is not available in V6 yet
    response.ok({
      healthy: true,
    })
  }
}
