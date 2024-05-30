import type { JobHandlerContract, Job } from '@its/sdk/types/queue'
import { inject } from '@adonisjs/core'
import { contractInstance } from '#services/ContractService';
import ClaimInfoService from '#services/claim_info_service'; 

export type syncClaimInfoJobPayload = {}

@inject()
export default class implements JobHandlerContract<syncClaimInfoJobPayload> {
  constructor(public job: Job, protected claimInfoService: ClaimInfoService) {
    this.job = job
  }

  /**
   * Base Entry point
   */
  async handle(__payload: syncClaimInfoJobPayload) {
    const totalClaimCurrent: number = await contractInstance.methods.totalClaim().call();
    const claimInfoMap = await this.claimInfoService.getMap();
    console.log(">>>>> Total claim in contract: " + totalClaimCurrent + " <<<<<");
    console.log(">>>>> Total records in db: " + claimInfoMap.size + " <<<<<");
    for (let index = 1; index <= totalClaimCurrent; index++) {
      const claimOrdinal: number = await contractInstance.methods.claimOrdinal(index).call();
      const claimInfo: any = await contractInstance.methods.bidInfo(claimOrdinal).call();
      const claimInfoExist = claimInfoMap.get(claimInfo.user);
      console.log("==== Scan user [" + claimInfo.user + "] !====[" + index + "]");
      console.log(claimInfoExist != null ? "User Already exist !":"User not exist !");
      if (claimInfoExist == null) {
        console.log(" **Start insert** ");
        printClaimInfo(claimInfo);
        this.claimInfoService.create({
          user: claimInfo.user,
          claimAmount: claimInfo.claimAmount,
          tokenId: claimInfo.tokenId,
          claimTime: parseInt(claimInfo.claimTime)
        });
        console.log(" **Insert Done** ");
      } else {
        printClaimInfo(claimInfo);
      }
    }
  }

  /**
   * This is an optional method that gets called if it exists when the retries has exceeded and is marked failed.
   */
  async failed() {}
}

declare module '@its/sdk/types/queue' {
  export interface JobList {
    '#jobs/sync_claim_infor_job': syncClaimInfoJobPayload
  }
}

function printClaimInfo(claimInfo: any) {
  console.log({
    user: claimInfo.user,
    claimAmount: parseInt(claimInfo.claimAmount),
    tokenId: parseInt(claimInfo.tokenId),
    claimTime: parseInt(claimInfo.claimTime)
  });
}