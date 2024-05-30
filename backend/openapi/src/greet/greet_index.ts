import { ApiResponse } from '#openapi/types'
import { Body, Controller, Example, Post, Route, Tags } from 'tsoa'

/**
 * @example {
 *   "someKey": "value",
 * }
 */
interface GreetIndexRequestData {
  someKey: string
}

interface GreetIndexResponseData {
  someKey: string
}

interface GreetIndexResponseMeta {}

interface GreetIndexResponse extends ApiResponse<GreetIndexResponseData, GreetIndexResponseMeta> {}

@Route('greet')
@Tags('Greet')
export class GreetIndexController extends Controller {
  /**
   * GreetIndex controller
   */
  @Example<GreetIndexResponse>({
    data: {
      someKey: 'value',
    },
    meta: {},
  })
  @Post('/')
  GreetStore(@Body() _body: GreetIndexRequestData): GreetIndexResponse {
    return {} as any
  }
}
