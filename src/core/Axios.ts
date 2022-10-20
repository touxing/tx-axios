import { AxiosInstance, AxiosPromise, AxiosRequestConfig } from '../types'
import dispacthRequest from './distpachRequest'

export default class Axios {
  request(config: AxiosInstance): AxiosPromise {
    return dispacthRequest(config)
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  private _requestMethodWithoutData(
    arg0: string,
    url: string,
    config: AxiosRequestConfig | undefined
  ): AxiosPromise {
    throw new Error('Method not implemented.')
  }
}
