// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { contractInstance , contractErc20Instance} from '#services/ContractService'
import { HttpContext } from '@adonisjs/core/http'


@inject()
export default class ContractsController {
    constructor() {
    }

    getTotalClaim({request}: HttpContext) {
        const address = request.input('address');
        const invalidAddress = () => {
            return address === 'INVALID';
        }
        const contractInfo = async () => {
            const totalBid = await contractInstance.methods.totalBid().call();
            const maxBid = await contractInstance.methods.maxBid().call();
            const minBid = await contractInstance.methods.minBid().call();
            const startTime = await contractInstance.methods.startTime().call();
            const endTime = await contractInstance.methods.endTime().call();
            const balanceOf = invalidAddress()? 0 : await contractErc20Instance.methods.balanceOf('0xeE0b3e6978DbB82FC1AcE2Fe29A3fd37efe98a43').call();
            const bidOrdinal = invalidAddress()? 0 : await contractInstance.methods.bidOrdinal(address).call();
            const {user, amount, bidTime, claimTime, claimAmount, tokenId}:{user:any, amount:any, bidTime:any, claimTime:any, claimAmount:any, tokenId:any} = 
            await contractInstance.methods.bidInfo(bidOrdinal).call();
            return {
                totalBid,
                maxBid,
                minBid,
                balanceOf,
                startTime,
                endTime,
                bidInfo: {
                    user,
                    amount,
                    bidTime,
                    claimTime,
                    claimAmount,
                    tokenId
                }
            }
        }
        
        return contractInfo();
    }
}