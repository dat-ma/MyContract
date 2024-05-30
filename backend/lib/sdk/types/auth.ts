import { LucidModel, ModelAttributes } from '@adonisjs/lucid/types/model'
import { RedisConnections } from '@adonisjs/redis/types'
import { Algorithm } from 'jsonwebtoken'
import { DateTime } from 'luxon'

export interface RefreshTokenContract {
  value: string
  expiresAt: DateTime
  expiresInMillis: number
}

export interface RefreshTokenProviderContract<Model extends LucidModel> {
  create(
    user: InstanceType<Model>,
    options?: {
      expiresInMillis?: number
    }
  ): Promise<RefreshTokenContract>

  verify(tokenValue: string): Promise<InstanceType<Model>>
}

export type RedisRefreshTokenProviderOptions<
  Model extends LucidModel,
  ConnectionName extends keyof RedisConnections,
> = {
  tokenableModel: Model
  expiresInMills: number
  primaryKey: keyof ModelAttributes<InstanceType<Model>>
  connection: ConnectionName
  prefix?: string
}

export interface JwtKey {
  verificationKey: string
  secret: string
}

export interface JwtAccessTokenProviderOptions<TokenableModel extends LucidModel> {
  tokenableModel: TokenableModel
  expiresInMillis: number
  key: JwtKey
  algorithm?: Algorithm
  primaryKey: string
  extraPayload?: (user: InstanceType<TokenableModel>) => Record<string, any>
  issuer?: string
  audience?: string
}
