import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'

export default function SignOut() {
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
        <button
            onClick={() => mutate()}
            className="bg-red-100 text-red-500 rounded px-4 py-1"
            disabled={isLoading}
        >
            Sign out
        </button>
    )
}
