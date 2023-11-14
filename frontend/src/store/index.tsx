import { atom, useAtom } from 'jotai'

export const userAtom = atom<string | undefined>(undefined)
export const useUser = () => useAtom(userAtom)
