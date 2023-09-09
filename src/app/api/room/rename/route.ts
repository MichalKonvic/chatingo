import { getServerSession } from "next-auth";
import { NextRequest } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { DatabaseEvents } from "@/lib/_DatabaseChecker";

export const POST = async (req: NextRequest) => {
    // Check if user is authorized
    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response("Unauthorized", {
            status: 401,
        })
    }
    if (!session.user?.email) {
        return
    }
    const { roomId, roomName }: { roomId: number, roomName: string } | { [key: string]: undefined } = await req.json();
    const databaseEvents: DatabaseEvents = cache.get("db-events", new DatabaseEvents());
    if (!roomId || !roomName) return new Response("Missing body", { status: 400 });
    try {
        await prisma?.room.update({
            where: {
                id: roomId
            },
            data: {
                name: roomName
            }
        })
    } catch (error) {
        console.log(error)
        return new Response("Error", { status: 500 });
    }
    databaseEvents.check();
    return new Response("Success", { status: 200 });
}