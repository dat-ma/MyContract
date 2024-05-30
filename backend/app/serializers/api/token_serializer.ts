import { AccessToken } from '@adonisjs/auth/access_tokens'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { RefreshTokenContract } from '@its/sdk/types/auth'

export default class TokenSerializer extends BaseModel {
  @column()
  declare type: string

  @column()
  declare token: string

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare refreshToken: string

  @column.dateTime()
  declare refreshTokenExpiresAt: DateTime

  constructor(accessToken: AccessToken, refreshToken: RefreshTokenContract) {
    super()

    this.type = 'bearer'
    this.token = accessToken.value!.release()
    this.expiresAt = DateTime.fromJSDate(accessToken.expiresAt!)
    this.refreshToken = refreshToken.value
    this.refreshTokenExpiresAt = refreshToken.expiresAt
  }
}
