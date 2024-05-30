/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ClaimsController from "#controllers/claims_controller";
import ContractsController from '#controllers/debugging/contracts_controller';

router.resource('health', () => import('@its/sdk/controllers/health_controller')).only(['index'])

router
  .group(() => {
    router.put('tokens', [() => import('#controllers/api/v1/refresh_token_controller')])
  })
  .prefix('api/v1')

router
  .group(() => {
    router.resource('greet', () => import('#controllers/greets_controller'))
      .only(['index', 'store'])
    router.post('/claim-infos/create', [ClaimsController, 'create'])
    router.put('/claim-infos/update/:id', [ClaimsController, 'update'])
    router.get('/claim-infos/:id', [ClaimsController, 'getById'])
    router.get('/claim-infos', [ClaimsController, 'gets'])
  })
  .prefix('api/v1')
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )

router
  .group(() => {
    router.post('tokens', [() => import('#controllers/debugging/login_controller')])
    router.get('/total-bid', [ContractsController, 'getTotalClaim']);
  })
  .prefix('api/debug')
