// import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { contractInstance } from '#services/ContractService'

@inject()
export default class ContractsController {
    constructor() {
    }

    getTotalClaim() {
        return contractInstance.methods.totalBid().call();
    }
}