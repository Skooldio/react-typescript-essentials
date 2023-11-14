'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from '@/store'

const signForm = z.object({
    username: z.string().min(5),
    password: z.string().min(5)
})

type SignForm = z.infer<typeof signForm>

export default function SignUp() {
    const [user, setUser] = useUser()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignForm>({
        resolver: zodResolver(signForm)
    })

    const { mutate, data, isLoading, error } = useMutation<
        string,
        Error,
        SignForm
    >({
        mutationFn: (value) =>
            fetch('http://localhost:8080/auth/sign-in', {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(value)
            }).then((x) => x.text())
    })

    if (data) {
        setUser(data)

        return <h1>Loading</h1>
    }

    return (
        <form
            className="flex flex-col max-w-sm mx-auto gap-4"
            onSubmit={handleSubmit((value) => mutate(value))}
        >
            <h1>Sign In</h1>
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

            {error && <p className="text-red-500">{error.message}</p>}
            <button
                className="bg-blue-500 text-white rounded py-2"
                disabled={isLoading}
            >
                Sign In
            </button>
        </form>
    )
}
