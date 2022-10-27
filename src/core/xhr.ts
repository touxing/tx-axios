import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/headers'
import { createError } from '../helpers/error'
import { isURLSameOrigin } from '../helpers/url'
import cookie from '../helpers/cookie'
import { isFormData } from '../helpers/util'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownLoadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    // 优化代码结构
    // 创建一个 request 实例。
    // 执行 request.open 方法初始化。
    // 执行 configureRequest 配置 request 对象。
    // 执行 addEvents 给 request 添加事件处理函数。
    // 执行 processHeaders 处理请求 headers。
    // 执行 processCancel 处理请求取消逻辑。
    // 执行 request.send 方法发送请求。
    const request = new XMLHttpRequest()

    // 新建ajax请求
    request.open(method.toUpperCase(), url!, true)

    configureRequest()

    addEvents()

    processHeaders()

    processCancel()

    // 发起ajax请求
    request.send(data)

    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }
      if (timeout) {
        request.timeout = timeout
      }
      // 跨域是否携带cookie
      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    function addEvents(): void {
      // 请求完成回调
      request.onreadystatechange = function handleLoad() {
        // 请求状态不成功
        if (request.readyState !== 4) {
          return
        }
        // 网络错误或超时
        if (request.status === 0) {
          return
        }

        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        const responseData = responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        handleResponse(response)
      }

      // 处理错误
      request.onerror = function handleError() {
        reject(createError('Network Error ', config, null, request))
      }

      // 处理请求超时
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      // 监听下载进度
      if (onDownLoadProgress) {
        request.onprogress = onDownLoadProgress
      }

      // 监听上传进度
      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    function processHeaders(): void {
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      // 跨域是否携带cookie
      if (withCredentials || (isURLSameOrigin(url!) && xsrfCookieName)) {
        const xsrfValue = cookie.read(xsrfCookieName!)
        if (xsrfValue) {
          headers[xsrfHeaderName!] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse) {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
