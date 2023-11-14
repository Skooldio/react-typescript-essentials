import { edenTreaty } from '@elysiajs/eden'
import type { App } from 'server'

export const api = edenTreaty<App>('http://localhost:8080', {
    fetcher: (url, options) => {
        return fetch(url, {
            ...options,
            credentials: 'include'
        })
    }
})
