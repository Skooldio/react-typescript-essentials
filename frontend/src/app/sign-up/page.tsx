'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/libs'

const signForm = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
})

type SignForm = z.infer<typeof signForm>

export default function SignUp() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignForm>({
        resolver: zodResolver(signForm)
    })

    const router = useRouter()

    const { mutate, data: response, isLoading, error } = useMutation({
        mutationFn: (value: SignForm) => api.auth['sign-up'].put(value)
    })

    if (response?.data)
        return (
            <main className="flex flex-col gap-4 max-w-sm">
                <h1 className="text-2xl font-medium">Sign up successfully</h1>
                <p className="text-base text-gray-500">
                    You have successfully sign up for the journal app, please go
                    to the sign in to start your first journal
                </p>
                <Link
                    className="text-center bg-blue-500 text-white rounded py-2 mt-4"
                    href="/sign-in"
                >
                    Sign in
                </Link>
            </main>
        )

    return (
        <form
            className="flex flex-col max-w-[16em] w-full mx-auto gap-4"
            onSubmit={handleSubmit((value) => mutate(value))}
        >
            <h1 className="text-2xl">Sign Up</h1>
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

            {response?.error && <p className="text-red-500">{response.error.message}</p>}
            <button
                className="bg-blue-500 text-white rounded py-2"
                disabled={isLoading}
            >
                Sign Up
            </button>

            <p className="text-sm text-gray-400">Already have an account?</p>
            <Link
                className="bg-blue-50 text-center text-blue-500 rounded py-2 px-4"
                href="/sign-in"
            >
                Sign In
            </Link>
        </form>
    )
}
