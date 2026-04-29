import * as z from 'zod'

const UserData = z.object({
    user_id: z.number(),
    name: z.string(),
    email: z.string(),
    role: z.enum(['admin', 'customer'])
})

export type UserDataType = z.infer<typeof UserData>