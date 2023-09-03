import { ChannelType } from '@prisma/client'
import { z } from 'zod'

export const CreateChannelShema = z.object({
    name: z.string().min(1, {
        message: 'Channel name is required.',
    }).refine(
        name => name.toLowerCase() !== 'general',
        {
            message: "Channel name cannot be 'general'"
        }
    ),
    type: z.nativeEnum(ChannelType)
})

export type CreateChannelRequest = z.infer<typeof CreateChannelShema>
