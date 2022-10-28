import { AxiosRequestConfig } from './../../dist/types/types/index.d'
import { isPlainObject, isString } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any, headers?: any): any {
  let result = data
  const JSONRequested = headers?.['content-type']?.indexOf('application/json') > -1
  if (data && isString(data) && JSONRequested) {
    try {
      result = JSON.parse(data)
    } catch (e) {
      throw e
    }
  }
  return result
}
