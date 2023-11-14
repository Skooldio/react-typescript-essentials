import { api } from '@/libs'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useForm } from 'react-hook-form'

interface JournalContent {
    content: string
}

export default function useJournalHook() {
    const { register, handleSubmit } = useForm<JournalContent>()

    const {
        refetch: reloadJournal,
        data: { data: journals = [] } = {},
        isLoading,
        isError: isJournalFetchedError
    } = useQuery({
        queryKey: ['blog.list'],
        queryFn: () => api.blog.list.get()
    })

    const { mutate: createJournal, isLoading: isJournalCreating } = useMutation(
        {
            mutationKey: ['journal.create'],
            mutationFn: async (data: JournalContent) => {
                await api.blog.put(data)
                await reloadJournal()
            }
        }
    )
    return {
        register,
        handleSubmit,
        createJournal,
        isJournalCreating,
        isJournalFetchedError,
        reloadJournal,
        journals
    }
}
