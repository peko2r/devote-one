const isServer = 'undefined' === typeof window
const isBrowser = !isServer
const isTest = process.env.NEXT_PUBLIC_ENV === 'development' || process.env.NEXT_PUBLIC_ENV === 'test'

console.log('isTest', isTest)
console.log('process.env.ENV', process.env.NEXT_PUBLIC_ENV)
const backend = isTest ? 'test' : 'prod'
console.log('backend', backend)
const ENV = {
  isBrowser,
  isServer,
  backend,
}

export { isServer, isBrowser, isTest, backend, ENV }
