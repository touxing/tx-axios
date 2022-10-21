import { isPlainObject } from './util'

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

export function transformResponse(data: any): any {
  let result = null
  if (typeof data === 'string' && data !== '') {
    try {
      result = JSON.parse(data)
    } catch (error) {
      console.warn(error)
    }
  }
  return result
}
