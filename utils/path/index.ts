import { ENV } from '@/utils/env'

export function getSpaceListUrl(page: number, limit: number, address?: string, tick?: string) {
  const url = `${ENV.backend}/proposal/ticks?page=${page}&limit=${limit}${address ? `&address=${address}` : ''}${tick ? `&tick=${tick}` : ''}`
  console.log('getSpaceListUrl', url)
  return url
}
