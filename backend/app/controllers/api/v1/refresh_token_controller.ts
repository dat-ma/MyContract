import User from '#models/user'
import TokenSerializer from '#serializers/api/token_serializer'
import type { HttpContext } from '@adonisjs/core/http'

export default class RefreshTokenController {
  async handle({ request, response }: HttpContext) {
    const refreshToken = request.input('refresh_token')
    const user = await User.refreshToken.verify(refreshToken)
    response.ok({
      data: new TokenSerializer(
        await User.accessTokens.create(user),
        await User.refreshToken.create(user)
      ),
    })
  }
}
