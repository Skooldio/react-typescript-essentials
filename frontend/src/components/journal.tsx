import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function Journal() {
    const { mutate, data, isLoading, isError } = useMutation({
        mutationFn: () =>
            fetch('http://localhost:8080/auth/sign-out', {
                credentials: 'include'
            }).then((x) => x.text())
    })

    useEffect(() => {
        if (data) window.location.reload()
    }, [data])

    return (
        <main className="flex flex-col justify-center items-center w-full min-h-screen gap-4">
            <p>Welcome to journal</p>

            <button
                onClick={() => mutate()}
                className="bg-red-100 text-red-500 rounded px-4 py-1"
                disabled={isLoading}
            >
                Sign out
            </button>
        </main>
    )
}
