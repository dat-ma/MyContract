import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { LucidModel } from '@adonisjs/lucid/types/model'
import { RedisConnections, RedisService } from '@adonisjs/redis/types'
import { errors } from '@adonisjs/auth'
import {
  RedisRefreshTokenProviderOptions,
  RefreshTokenContract,
  RefreshTokenProviderContract,
} from '../../types/auth.js'

export class RedisRefreshTokenProvider<
  Model extends LucidModel,
  ConnectionName extends keyof RedisConnections,
> implements RefreshTokenProviderContract<Model>
{
  static forModel<Model extends LucidModel, ConnectionName extends keyof RedisConnections>(
    model: RedisRefreshTokenProviderOptions<Model, ConnectionName>['tokenableModel'],
    options: Omit<RedisRefreshTokenProviderOptions<Model, ConnectionName>, 'tokenableModel'>,
    redis: RedisService
  ): RedisRefreshTokenProvider<Model, ConnectionName> {
    return new RedisRefreshTokenProvider<Model, ConnectionName>(redis, {
      ...options,
      tokenableModel: model,
      prefix: options.prefix ?? 'rft_',
    })
  }

  constructor(
    private redis: RedisService,
    private options: RedisRefreshTokenProviderOptions<Model, ConnectionName>
  ) {}

  async create(
    user: InstanceType<Model>,
    options?: { expiresInMillis?: number } | undefined
  ): Promise<RefreshTokenContract> {
    return this.generate(user, options?.expiresInMillis ?? this.options.expiresInMills)
  }

  async verify(tokenValue: string): Promise<InstanceType<Model>> {
    if (!tokenValue) {
      throw new errors.E_INVALID_CREDENTIALS('Invalid refresh token')
    }

    const userPrimaryKeyValue = await this.redis.get(tokenValue)
    const user = await this.options.tokenableModel.findBy(
      this.options.primaryKey as string,
      userPrimaryKeyValue
    )

    if (!user) {
      throw new errors.E_INVALID_CREDENTIALS('Invalid refresh token')
    }

    await this.redis.del(tokenValue)

    return user
  }

  async generate(
    user: InstanceType<Model>,
    expiresInMillis: number
  ): Promise<RefreshTokenContract> {
    const token = {
      value: `${this.options.prefix}${uuid()}`,
      expiresInMillis: expiresInMillis ?? this.options.expiresInMills,
      expiresAt: DateTime.now().plus({ milliseconds: this.options.expiresInMills }),
    }

    await this.redis.set(
      token.value,
      user.$getAttribute(this.options.primaryKey as string),
      'PX',
      token.expiresInMillis
    )

    return token
  }
}
