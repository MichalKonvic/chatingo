import { roomT } from "@/pages/api/socketio";
import prisma from "./prisma";
export const getUserRooms = async (userEmail: string) => (await prisma?.user.findFirst({
    select: {
        rooms: {
            select: {
                id: true,
                name: true,
                messages: {
                    select: {
                        content: true,
                        createdAt: true,
                        author: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                },
                members: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            },
        }
    },
    where: {
        email: userEmail
    }
}))?.rooms as roomT[];