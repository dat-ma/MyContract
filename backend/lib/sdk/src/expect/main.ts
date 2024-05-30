import { MatcherFunction } from 'expect'
import { ApiResponse } from '@japa/api-client'

export const toHaveHttpStatus: MatcherFunction<[status: number]> = function (
  actualResponse: unknown,
  expectedStatus
) {
  const response = actualResponse as ApiResponse

  const pass = response.status() === expectedStatus

  if (pass) {
    return {
      message: () => `expected ${response.status} not to be ${expectedStatus}`,
      pass: true,
    }
  } else {
    return {
      message: () => `expected ${response.status} to be ${expectedStatus}`,
      pass: false,
    }
  }
}

export const toHaveHttpStatusBetween: MatcherFunction<[min: number, max: number]> = function (
  actualResponse: unknown,
  min,
  max
) {
  const response = actualResponse as ApiResponse

  const pass = response.status() >= min && response.body()['status'] <= max

  if (pass) {
    return {
      message: () => `expected ${response.status} not to be in range [${min}, ${max}]`,
      pass: true,
    }
  } else {
    return {
      message: () => `expected ${response.status} to be in range [${min}, ${max}]`,
      pass: false,
    }
  }
}

const httpStatusRangeMatcher = (min: number, max: number): MatcherFunction<[]> => {
  return function (actualResponse: unknown) {
    const response = actualResponse as ApiResponse

    return toHaveHttpStatusBetween.bind(this)(response, min, max)
  }
}

export const toHaveHttpStatusSuccess = httpStatusRangeMatcher(200, 299)
export const toHaveHttpStatusRedirect = httpStatusRangeMatcher(300, 399)
export const toHaveHttpStatusClientError = httpStatusRangeMatcher(400, 499)
export const toHaveHttpStatusServerError = httpStatusRangeMatcher(500, 599)
