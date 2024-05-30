import ClaimInfo from "#models/claim_info"
import { DateTime } from "luxon";

export default class ClaimInfoService {
    async create(claim_request: Record<string, any>) {
        const claim_info = await ClaimInfo.create({
            user: claim_request['user'],
            claimAmount: claim_request['claimAmount'],
            tokenId: claim_request['tokenId'],
            claimTime: DateTime.fromMillis(claim_request['claimTime'] * 1000)
        })
        
        return claim_info;
    }

    async update(id: number, claim_request: Record<string, any>) {
        const claim_info = await ClaimInfo.find(id);
        if (claim_info) {
            claim_info.user = claim_request['user'];
            claim_info.claimAmount = claim_request['claimAmount'],
            claim_info.tokenId = claim_request['tokenId'],
            claim_info.claimTime = DateTime.fromMillis(claim_request['claimTime'] * 1000)
        }
        return await claim_info?.save();
    }

    async getById(id: number) {
        return ClaimInfo.find(id)
    }

    async gets() {
        return ClaimInfo.all()
    }

    async getMap() {
        const mapClaimInfo = new Map();
        (await ClaimInfo.all()).forEach(ClaimInfo => {
            mapClaimInfo.set(ClaimInfo.user, ClaimInfo)
        });
        return mapClaimInfo;
    }

    async getByUser(userAddress: string) {
        return ClaimInfo.findBy("user", userAddress);
    }
}
