'use client'
import { api } from '@/libs'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function SignOut() {
    const { mutate, data, isLoading, isError } = useMutation({
        mutationFn: () => api.auth['sign-out'].get()
    })

    useEffect(() => {
        if (data) window.location.reload()
    }, [data])

    return (
        <button
            onClick={() => mutate()}
            className="hover:bg-red-100 focus:bg-red-100 text-sm text-red-400 rounded px-4 py-2 transition-colors"
            disabled={isLoading}
        >
            Sign out
        </button>
    )
}
