import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BidInfo extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user: string

  @column()
  declare claimAmount: number

  @column()
  declare tokenId: number

  @column.dateTime()
  declare claimTime: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}