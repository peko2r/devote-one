const isServer = 'undefined' === typeof window
const isBrowser = !isServer
const isTest = process.env.NEXT_PUBLIC_ENV === 'test'
const isLocal = process.env.NEXT_PUBLIC_ENV === 'local'

console.log('process.env.NEXT_PUBLIC_ENV', process.env.NEXT_PUBLIC_ENV)
const backend = isTest ? 'test' : isLocal ? 'mock' : 'prod'
console.log('backend', backend)
const ENV = {
  isBrowser,
  isServer,
  backend,
}

export { isServer, isBrowser, isTest, backend, ENV }
