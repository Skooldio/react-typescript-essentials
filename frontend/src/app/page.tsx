'use client'

import useJournalHook from './hooks'
import { Card, SignOut } from '@/components'

export default function Journal() {
    const {
        journals,
        reloadJournal,
        isJournalFetchedError,
        register,
        handleSubmit,
        createJournal,
        isJournalCreating
    } = useJournalHook()

    return (
        <div className="w-full min-h-screen bg-slate-50">
            <nav className="sticky top-0 w-full flex justify-between items-center h-12 border-b px-4 bg-white">
                <h1>Journal App</h1>
                <SignOut />
            </nav>
            <main className="flex flex-col justify-start items-center w-full max-w-md min-h-screen gap-4 mx-auto py-6">
                <form
                    className="flex flex-col w-full gap-4 p-4 bg-white rounded-lg border shadow"
                    onSubmit={handleSubmit((data) => createJournal(data))}
                >
                    <textarea
                        {...register('content')}
                        className="bg-gray-100 max-w-md w-full rounded-lg p-2 outline-none"
                        placeholder="What's in your mind today?"
                        rows={4}
                    />
                    <button
                        type="submit"
                        disabled={isJournalCreating}
                        className={`${
                            isJournalCreating ? 'bg-slate-100' : 'bg-blue-50'
                        } text-blue-500 px-4 py-2 rounded-lg`}
                    >
                        Create new post
                    </button>
                </form>

                {isJournalCreating ? (
                    <h1>Loading</h1>
                ) : isJournalCreating ? (
                    <button onClick={() => reloadJournal()}>Reload</button>
                ) : journals ? (
                    <ul className="flex flex-col max-w-md w-full mx-auto gap-4">
                        {journals.map(({ id, content }) => (
                            <Card
                                key={id}
                                {...{ id, content, reloadJournal }}
                            />
                        ))}
                    </ul>
                ) : undefined}
            </main>
        </div>
    )
}
