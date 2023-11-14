'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from '@/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/libs'

const signForm = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
})

type SignForm = z.infer<typeof signForm>

export default function SignUp() {
    const [user, setUser] = useUser()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignForm>({
        resolver: zodResolver(signForm)
    })

    const {
        mutate,
        data: response,
        isLoading,
        error
    } = useMutation({
        mutationFn: (value: SignForm) => api.auth['sign-in'].post(value)
    })

    if (response?.data) {
        setUser(response.data)
        router.replace('/')

        return <h1>Loading</h1>
    }

    return (
        <form
            className="flex flex-col max-w-[16em] w-full mx-auto gap-4"
            onSubmit={handleSubmit((value) => mutate(value))}
        >
            <h1 className="text-2xl">Sign In</h1>
            <input
                {...register('username')}
                type="text"
                name="username"
                placeholder="username"
                className="border-2 px-2 py-1"
            />
            {errors.username && (
                <p className="text-red-500">
                    Username {errors.username.message}
                </p>
            )}

            <input
                {...register('password')}
                type="password"
                name="password"
                placeholder="password"
                className="border-2 px-2 py-1"
            />
            {errors.password && (
                <p className="text-red-500">
                    Password {errors.password.message}
                </p>
            )}

            {response?.error && (
                <p className="text-red-500">{response.error.message}</p>
            )}

            <button
                className="bg-blue-500 text-white rounded py-2"
                disabled={isLoading}
            >
                Sign In
            </button>

            <p className="text-sm text-gray-400">Don&apos;t have an account?</p>
            <Link
                className="bg-blue-50 text-center text-blue-500 rounded py-2 px-4"
                href="/sign-up"
            >
                Sign Up
            </Link>
        </form>
    )
}
