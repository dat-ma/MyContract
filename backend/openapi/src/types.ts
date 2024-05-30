export interface ApiResponse<TRes, TMeta = {}> {
  data: TRes
  meta: TMeta
}
