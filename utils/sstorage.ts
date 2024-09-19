import { ENV } from './env'
export interface SStorageData {}

type KEY = keyof SStorageData

function getItem<K extends keyof SStorageData, R = SStorageData[K]>(key: K): R | undefined {
  if (ENV.isServer || !window.sessionStorage.getItem(key)) return undefined
  return JSON.parse(window.sessionStorage.getItem(key) as string) as R
}

function setItem<K extends keyof SStorageData, V = SStorageData[K]>(key: KEY, value: V) {
  if (!ENV.isServer) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }
}

function remove(key: KEY) {
  if (!ENV.isServer) {
    window.sessionStorage.removeItem(key)
  }
}

function clear() {
  if (!ENV.isServer) {
    window.sessionStorage.clear()
  }
}

export const sstorage = {
  getItem,
  setItem,
  remove,
  clear,
}
