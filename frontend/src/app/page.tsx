'use client'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import SignIn from '@/components/signIn'
import SignUp from '@/components/signUp'
import Journal from '@/components/journal'
import { useUser } from '@/store'

export default function MyPage() {
    const [user, setUser] = useUser()

    const { data, isLoading, isError } = useQuery({
        queryFn: () =>
            fetch('http://localhost:8080/auth/refresh', {
                credentials: 'include'
            }).then((x) => x.text())
    })

    useEffect(() => {
        setUser(data)
    }, [data, setUser])

    if (isLoading) return <h1 className="text-2xl">Loading</h1>

    if (user === 'Unauthorized')
        return (
            <main className="flex justify-center items-center w-full min-h-screen">
                <SignIn />
                <SignUp />
            </main>
        )

    return <Journal />
}
