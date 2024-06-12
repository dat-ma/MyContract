import type { JobHandlerContract, Job } from '@its/sdk/types/queue';
import PlaceBid from '#models/place_bid';
import { contractInstance } from '#services/ContractService';

export type sync_bid_infoJobPayload = {}

export default class implements JobHandlerContract<sync_bid_infoJobPayload> {
  constructor(public job: Job) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  async handle() {
    const maxBidNonce = await PlaceBid.query()
      .countDistinct('bid_nonce as bid_nonce')
      .count('* as total')
    const lastestBidNonce:number = maxBidNonce[0].bidNonce

    const totalUser:number = await contractInstance.methods.totalUser().call();

    if (lastestBidNonce < totalUser) {
      let bidInfoPromise = []
      for (let nonce = lastestBidNonce + 1; nonce <= totalUser; nonce++) {
        const bidInfo:any = await contractInstance.methods.bidInfo(nonce).call();
        console.log(bidInfo);
        
        bidInfoPromise.push(bidInfo);
        PlaceBid.create({
          walletAddress: bidInfo.user,
          amount: bidInfo.amount,
          bidTime: parseInt(bidInfo.bidTime),
          bidNonce: nonce,
        })
      }
      await Promise.all(bidInfoPromise)
    }
    return
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed() {}
}

declare module '@its/sdk/types/queue' {
  export interface JobList {
    '#jobs/sync_bid_info_job': sync_bid_infoJobPayload
  }
}