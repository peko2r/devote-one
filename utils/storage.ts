import { ENV } from './env'

export interface LoginData {
  token: string
  expires_at: number
  address: string
}

export interface uniSatData {
  connected: boolean
  currentORDAddress: string
}

export type StorageData = uniSatData & LoginData

type KEY = keyof StorageData

const { isServer } = ENV

function getItem<K extends keyof StorageData, R = StorageData[K]>(key: K): R | undefined {
  if (isServer || !window.localStorage.getItem(key)) return undefined
  return JSON.parse(window.localStorage.getItem(key) as string) as R
}

function setItem<K extends keyof StorageData, V = StorageData[K]>(key: KEY, value: V) {
  if (!isServer) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

function remove(key: KEY) {
  if (!isServer) {
    window.localStorage.removeItem(key)
  }
}

function clear() {
  if (!isServer) {
    window.localStorage.clear()
  }
}

export const storage = {
  getItem,
  setItem,
  remove,
  clear,
}
