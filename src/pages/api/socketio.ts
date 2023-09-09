import { NextApiRequest, NextApiResponse } from "next";
import { Server } from 'socket.io'
import { Prisma } from "@prisma/client";
import { onConnection } from "@/lib/SocketHandler";

export type roomT = Prisma.RoomGetPayload<{
    select: {
        members: {
            select: {
                email: true,
                id: true
            }
        },
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
        id: true,
        name: true
    }
}>
export type messageT = roomT["messages"][number];
export type memberT = roomT["members"][number];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (res?.socket?.server?.io) {
        if (process.env.NODE_ENV === "development") {
            res.end();
            return;
        }
        console.warn("- \x1b[33mwarn\x1b[0m Reloading socket.io server\n- \x1b[96mPlease reload all clients so they have same socket.io server instance.\x1b[0m");
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        res.socket.server.io.removeAllListeners();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        res.socket.server.io.on("connection", onConnection(res.socket.server.io));
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const io = new Server(res.socket.server, {
        addTrailingSlash: false,
        allowEIO3: true
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    res.socket.server.io = io.on("connection", onConnection(io));
    res.end()
}
export const config = {
    api: {
        bodyParser: false
    }
}
