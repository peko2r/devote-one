import { ENV, isTest } from '@/utils/env'

const API_KEY = 'ca0477609f8ea0400029ad833032190c284045fa9daac788454aba4f28d909f3'
const API_KEY2 = '5a136b1ee2168404e30a774390570b1de9f96efd953148b5d95fddfa688e2e1b'
const API_KEY3 = 'fdb13a30a45e90d9960c7f4aac93a6548a0137fd5cec5e29fdba0749f52d1461'

const headers = new Headers({
  Authorization: `Bearer ${API_KEY2}`,
  'Content-Type': 'application/json',
})

export type Proposal = {
  tick: string
  title: string
  vote_type: number
  start_time: number
  end_time: number
  snapshot_time: number
  options: Array<{ content: string }>
  address: string
}

export type VoteParams = {
  tick: string
  id: number
  address: string
  proposal_vote_id: number
  proposal_vote_option_ids: number[]
}

export const addProposal = async (data: Proposal) => {
  const response = await fetch(`${ENV.backend}/proposal/${data.tick}/votes`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return await response.json()
}

export const deleteProposal = async (tick: string, id: number, address: string, signature: string) => {
  const response = await fetch(`${ENV.backend}/proposal/${tick}/votes/${id}/delete`, {
    method: 'POST',
    body: JSON.stringify({
      address,
      id,
      signature,
    }),
  })
  return await response.json()
}

export const vote = async (data: VoteParams) => {
  const response = await fetch(`${ENV.backend}/proposal/${data.tick}/votes/${data.id}/add`, {
    method: 'POST',
    body: JSON.stringify({
      address: data.address,
      proposal_vote_id: data.proposal_vote_id,
      proposal_vote_option_ids: data.proposal_vote_option_ids,
      tick: data.tick,
    }),
  })
  return await response.json()
}

export const getVoteInfo = async (data: { tick: string; id: number }) => {
  const response = await fetch(`${ENV.backend}/proposal/${data.tick}/votes/${data.id}/options`)
  return await response.json()
}

export const getVotesList = async (data: {
  tick: string
  id: number
  address?: string
  limit?: number
  page?: number
}) => {
  let response
  if (!data?.address) {
    response = await fetch(
      `${ENV.backend}/proposal/${data.tick}/votes/${data.id}/list?limit=${data.limit}&page=${data.page}`,
      {
        cache: 'no-store',
      },
    )
  } else {
    response = await fetch(
      `${ENV.backend}/proposal/${data.tick}/votes/${data.id}/list?address=${data.address}&limit=${data.limit}&page=${data.page}`,
      {
        cache: 'no-store',
      },
    )
  }

  return await response.json()
}

export const getAddressBalance = async (data: { address: string; tick: string; block_height?: number }) => {
  let response
  if (data?.block_height) {
    response = await fetch(
      `${ENV.backend}/address/brc20/balance?address=${data.address}&tick=${data.tick}&block_height=${data?.block_height}`,
    )
  } else {
    response = await fetch(`${ENV.backend}/address/brc20/balance?address=${data.address}&tick=${data.tick}`)
  }

  return await response.json()
}
