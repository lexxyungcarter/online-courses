import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { EditChatSchema } from "@/lib/validators/chats";
import { NextApiResponseServerIo } from "@/types/common";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'DELETE' && req.method !== 'PATCH') {
        return res.status(405).json({ error: "MEthod not allowed!" })
    }

    try {
        const profile = await currentProfilePages(req)

        const { serverId, channelId, messageId } = req.query

        if (!serverId) return res.status(400).json({
            message: "Server ID missing"
        })

        if (!channelId) return res.status(400).json({
            message: "Channel ID missing"
        })

        if (!profile) return res.status(401).json({
            message: "Unauthorized"
        })

        const server = await db.server.findFirst({
            where: {
                id: String(serverId),
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true,
            }
        })

        if (!server) return res.status(404).json({
            message: "Server Not Found"
        })

        const channel = await db.channel.findFirst({
            where: {
                id: String(channelId),
                serverId: server.id
            }
        })

        if (!channel) return res.status(404).json({
            message: "Channel Not Found"
        })

        const member = server.members.find(it => it.profileId === profile.id)

        if (!member) return res.status(404).json({
            message: "Member Not Found"
        })

        let message = await db.message.findFirst({
            where: {
                id: String(messageId),
                channelId: channel.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!message || message.deleted) return res.status(404).json({
            message: "Message Not Found"
        })


        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR
        const canModify = isMessageOwner || isAdmin || isModerator

        if (!canModify) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        if (req.method === 'DELETE') {
            message = await db.message.update({
                where: {
                    id: message.id,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        if (req.method === 'PATCH') {
            if (!isMessageOwner) return res.status(401).json({
                message: "Unauthorized"
            })

            const { content } = EditChatSchema.parse(req.body)

            message = await db.message.update({
                where: {
                    id: message.id,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${channelId}:messages:update`

        res?.socket?.server?.io?.emit(updateKey, message)

        return res.status(200).json(message)

    } catch (error) {
        console.log("[MESSAGES_ID]", error);
        return res.status(500).json({
            message: "Internal Error"
        })
    }
}