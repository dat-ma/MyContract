import User from '#models/user'
import TokenSerializer from '#serializers/api/token_serializer'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async handle({ request, response }: HttpContext) {
    const userId = request.body()['id']
    const user = await User.findOrFail(userId)
    response.ok({
      data: new TokenSerializer(
        await User.accessTokens.create(user),
        await User.refreshToken.create(user)
      ),
    })
  }
}
