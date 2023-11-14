'use client'
import { type ReactNode, useEffect } from 'react'

import Link from 'next/link'

import { useUser } from '@/store'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { api } from '@/libs'

export function Layout({ children }: { children: ReactNode }) {
    const [user, setUser] = useUser()
    const pathname = usePathname()

    const {
        data: response,
        isLoading,
        isError
    } = useQuery({
        queryFn: () => api.auth.refresh.get(),
        enabled: pathname === '/'
    })

    useEffect(() => {
        if (response?.data) setUser(response.data)
    }, [response, setUser])

    if (pathname === '/') {
        if (isLoading)
            return (
                <main className="flex justify-center items-center w-full min-h-screen">
                    <h1 className="text-2xl">Loading</h1>
                </main>
            )

        if (response?.error)
            return (
                <main className="flex flex-col justify-center items-start gap-3 w-full max-w-sm min-h-screen mx-auto">
                    <h1 className="text-4xl">Journal</h1>
                    <p className="text-gray-600">
                        Start your first journaling today, taking the journey of
                        your life
                    </p>
                    <Link
                        className="bg-blue-500 text-white rounded py-2 px-4 mt-2"
                        href="/sign-in"
                    >
                        Start my first journal
                    </Link>
                </main>
            )
    }

    return children
}
