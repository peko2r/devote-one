import EventEmitter from 'events'

export const globalEvent = new EventEmitter()

export enum GlobalEventName {}

// TokenChange = 'TokenChange',
// HttpError = 'HttpError',

export interface EventType {
  // [SLEventName.TokenChange]: null
  // [SLEventName.HttpError]: HttpError
}
