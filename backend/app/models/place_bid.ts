import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

export default class PlaceBid extends BaseModel {
  @column({ isPrimary: true, serializeAs: null })
  declare id: number

  @column({ columnName: 'wallet_address' })
  declare walletAddress: string

  @column({ columnName: 'tx_hash' })
  declare txHash: string

  @column({ columnName: 'amount' })
  declare amount: string

  @column({ columnName: 'bid_time' })
  declare bidTime: number

  @column({ columnName: 'bid_nonce' })
  declare bidNonce: number

  @column({ columnName: 'previous_bid' })
  declare previousBid: number

  @belongsTo(() => PlaceBid, { foreignKey: 'previous_bid' })
  declare previousBids: relations.BelongsTo<typeof PlaceBid>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}