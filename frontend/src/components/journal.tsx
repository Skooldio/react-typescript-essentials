import { useEffect } from 'react'
import SignOut from './signOut'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

interface Journal {
    id: number
    content: string
    userId: string
}

interface JournalContent {
    content: string
}

export default function Journal() {
    const { register, handleSubmit } = useForm<JournalContent>()

    const { refetch, data, isLoading, isError } = useQuery<Journal[]>({
        queryKey: ['blog.list'],
        queryFn: () =>
            fetch('http://localhost:8080/blog/list', {
                credentials: 'include'
            }).then((x) => x.json())
    })

    const { mutate, isLoading: isMutating } = useMutation({
        mutationKey: ['journal.create'],
        mutationFn: async (data: JournalContent) => {
            await fetch('http://localhost:8080/blog', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((x) => x.json())

            await refetch()
        }
    })

    const { mutate: deleteJournal } = useMutation({
        mutationKey: ['journal.delete'],
        mutationFn: async (id: number) => {
            await fetch(`http://localhost:8080/blog/id/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            }).then((x) => x.text())

            await refetch()
        }
    })

    const { mutate: updateJournal } = useMutation({
        mutationKey: ['journal.update'],
        mutationFn: async ({
            id,
            content
        }: {
            id: number
            content: string
        }) => {
            await fetch(`http://localhost:8080/blog/id/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    content
                })
            }).then((x) => x.text())

            await refetch()
        }
    })

    return (
        <main className="flex flex-col justify-center items-center w-full min-h-screen gap-4">
            <p>Welcome to journal</p>

            <form onSubmit={handleSubmit((data) => mutate(data))}>
                <textarea
                    {...register('content')}
                    className="border-2 max-w-md w-full"
                />
                <button
                    type="submit"
                    disabled={isMutating}
                    className={`${
                        isMutating ? 'bg-slate-100' : 'bg-blue-50'
                    } text-blue-500 px-2 py-1 rounded`}
                >
                    Create new post
                </button>
            </form>

            {isLoading ? (
                <h1>Loading</h1>
            ) : isError ? (
                <button onClick={() => refetch()}>Reload</button>
            ) : data ? (
                <ul className="flex flex-col max-w-md w-full mx-auto gap-4">
                    {data.map(({ id, content }) => (
                        <li
                            key={id}
                            className="flex justify-between w-full px-4 py-2 rounded bg-slate-100"
                        >
                            <textarea
                                className="bg-transparent w-full outline-none"
                                onBlur={({ target: { value: content } }) => {
                                    updateJournal({
                                        id,
                                        content
                                    })
                                }}
                            >
                                {content}
                            </textarea>
                            <button
                                onClick={() => deleteJournal(id)}
                                className="p-4 rounded bg-red-50 text-red-500"
                            >
                                x
                            </button>
                        </li>
                    ))}
                </ul>
            ) : undefined}

            <hr />

            <SignOut />
        </main>
    )
}
