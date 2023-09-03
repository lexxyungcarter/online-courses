import { z } from 'zod'

export const CreateServerShema = z.object({
    name: z.string().min(1, {
        message: 'Server name is required.',
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
})

export type CreateServerRequest = z.infer<typeof CreateServerShema>
