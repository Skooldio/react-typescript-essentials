import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

import { auth, authController } from './auth'

const app = new Elysia({ forceErrorEncapsulation: true })
    .use(swagger())
    .use(
        cors({
            allowedHeaders: ['Content-Type'],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            preflight: true,
            credentials: true
        })
    )
    .get('/', () => 'Hello Elysia')
    .use(authController)
    .group(
        '/blog',
        {
            beforeHandle: ({ user }) => user.validate()
        },
        (app) =>
            app
                .get('/list', async ({ user, prisma }) =>
                    prisma.journal.findMany({
                        where: {
                            userId: await user.id
                        }
                    })
                )
                .put(
                    '',
                    async ({ user, prisma, body: { content } }) =>
                        prisma.journal.create({
                            data: {
                                userId: await user.id,
                                content
                            }
                        }),
                    {
                        body: t.Object({
                            content: t.String()
                        })
                    }
                )
                .guard(
                    {
                        params: t.Object({
                            id: t.Numeric()
                        })
                    },
                    (app) =>
                        app
                            .patch(
                                '/id/:id',
                                async ({
                                    user,
                                    prisma,
                                    body: { content },
                                    params: { id }
                                }) =>
                                    prisma.journal.update({
                                        data: {
                                            content
                                        },
                                        where: {
                                            id,
                                            userId: await user.id,
                                        }
                                    }),
                                {
                                    body: t.Object({
                                        content: t.String()
                                    })
                                }
                            )
                            .delete(
                                '/id/:id',
                                async ({ prisma, user, params: { id } }) =>
                                    prisma.journal.delete({
                                        where: {
                                            id,
                                            userId: await user.id
                                        }
                                    })
                            )
                )
    )
    .listen(8080)

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
