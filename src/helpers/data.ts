import { AxiosRequestConfig } from './../../dist/types/types/index.d'
import { isPlainObject, isString } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any, config?: AxiosRequestConfig): any {
  let result = data
  const JSONRequested = config?.responseType === 'json'
  if (data && isString(data) && JSONRequested) {
    try {
      result = JSON.parse(data)
    } catch (e) {
      throw e
    }
  }
  return result
}
