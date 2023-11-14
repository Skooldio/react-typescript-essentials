'use client'

import { api } from '@/libs'
import { useMutation } from '@tanstack/react-query'

const useJournalMutation = (reloadJournal: () => void) => {
    const { mutate: deleteJournal } = useMutation({
        mutationKey: ['journal.delete'],
        mutationFn: async (id: number) => {
            await api.blog.id[id].delete()

            await reloadJournal()
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
            await api.blog.id[id].patch({
                content
            })

            await reloadJournal()
        }
    })

    return {
        deleteJournal,
        updateJournal
    }
}

export default function Card({
    content,
    id,
    reloadJournal
}: {
    id: number
    content: string
    reloadJournal: () => void
}) {
    const { updateJournal, deleteJournal } = useJournalMutation(reloadJournal)

    return (
        <li className="relative flex justify-between w-full p-4 rounded bg-white border">
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
                className="absolute top-0 right-0 rounded p-2 m-1 hover:bg-gray-100 focus:bg-gray-100"
            >
                <img
                    src="/x.svg"
                    alt="Close button"
                    className="w-4 h-4 opacity-40 hover:opacity-100 focus:opacity-100 transition-colors"
                />
            </button>
        </li>
    )
}
