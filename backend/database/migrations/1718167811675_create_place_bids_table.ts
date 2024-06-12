import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected placeBid = 'place_bids'

  async up() {
    this.schema.createTable(this.placeBid, (table) => {
      table.increments('id').primary()
      table.string('wallet_address').notNullable()
      table.string('amount').notNullable()
      table.integer('bid_time').nullable()
      table.integer('bid_nonce').nullable()
      table.integer('previous_bid').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

  }

  async down() {
    this.schema.dropTable(this.placeBid)
  }
}