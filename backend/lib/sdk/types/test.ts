export type HttpResponseMatchers = {
  toHaveHttpStatus(status: number): void
  toHaveHttpStatusBetween(min: number, max: number): void
  toHaveHttpStatusSuccess(): void
  toHaveHttpStatusRedirect(): void
  toHaveHttpStatusClientError(): void
  toHaveHttpStatusServerError(): void
}
