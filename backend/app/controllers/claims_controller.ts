import ClaimInfoService from '#services/claim_info_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ClaimsController {
    constructor(protected claimInfoService: ClaimInfoService) {
    }

    create({request}: HttpContext) {
        const requestBody = request.body()
        return this.claimInfoService.create(requestBody)
    }

    update({request, params}: HttpContext) {
        const requestBody = request.body()
        return this.claimInfoService.update(params.id, requestBody)
    }

    getById({params}: HttpContext) {
        const id:number = params.id;
        return this.claimInfoService.getById(id);
    }

    gets() {
        return this.claimInfoService.gets();
    }

    getsQ() {
        
    }
}
