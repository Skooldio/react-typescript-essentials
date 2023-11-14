import { Elysia, t } from 'elysia'

import { Lucia } from '@elysiajs/lucia-auth'
import { PrismaClient } from '@prisma/client'

import { prisma as adapter } from '@lucia-auth/adapter-prisma'

const prisma = new PrismaClient()

const { elysia: auth, lucia } = Lucia({
    name: 'user',
    adapter: adapter(prisma)
})

export { auth }

export const authController = new Elysia({ prefix: '/auth' })
    .use(auth)
    .decorate({ prisma })
    .guard(
        {
            body: t.Object({
                username: t.String(),
                password: t.String()
            })
        },
        (app) =>
            app
                .put('/sign-up', async ({ body, user }) => user.signUp(body))
                .post(
                    '/sign-in',
                    async ({ user, body: { username, password }, set }) => {
                        await user.signIn(username, password)

                        return `Sign in as ${username}`
                    }
                )
    )
    .guard(
        {
            beforeHandle: ({ user: { validate } }) => validate()
        },
        (app) =>
            app
                .get('/profile', ({ user }) => user.data)
                .get('/refresh', async ({ user }) => {
                    // await user.refresh()

                    return user.data
                })
                .get('/sign-out', async ({ user }) => {
                    await user.signOut()

                    return 'Signed out'
                })
    )
