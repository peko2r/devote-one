export function sleep(time: number) {
  return new Promise((resolve, reject) => setTimeout(resolve, time))
}

export function getErrorMsg(e: any) {
  return e.reason || e.data?.message || e.message
}

export function isSameHash(hash1?: string, hash2?: string) {
  if (!hash1 || !hash2) return false
  if (hash1 === hash2) return true
  return hash1.toLowerCase() === hash2.toLowerCase()
}

export function NoOperation() {}
export async function NoOperationAsync() {}
