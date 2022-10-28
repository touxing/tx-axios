/**
 *
 * @returns 模拟的ajax请求
 */
export function getAjaxRequest(): Promise<JasmineAjaxRequest> {
  return new Promise(resolve => {
    setTimeout(() => {
      return resolve(jasmine.Ajax.requests.mostRecent())
    }, 0)
  })
}
