'use client'

import type { ReactNode } from 'react'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Provider } from 'jotai'

const client = new QueryClient()

export default function AppProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={client}>
            <Provider>{children}</Provider>
        </QueryClientProvider>
    )
}
