import type { NextPage } from 'next'

export type GetParamType<T> = T extends (...args: infer R) => any ? R : any

export type AsyncFuncRetType<T> = T extends () => Promise<infer R> ? R : any

export type MayBeArray<T> = T | T[]
