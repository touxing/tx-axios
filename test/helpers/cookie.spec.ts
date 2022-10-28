import cookie from '../../src/helpers/cookie'

describe('helpers:cookie', () => {
  test('should read cookie', () => {
    document.cookie = 'password=1234'
    expect(cookie.read('password')).toBe('1234')
  })

  test('should return null if cookie  name is not exist', () => {
    document.cookie = 'a=1'
    expect(cookie.read('name')).toBeNull()
  })
})
