import { getServerSession } from "next-auth";
import { NextRequest } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { DatabaseEvents } from "@/lib/_DatabaseChecker";
import cache from "@/lib/cache";
import { isArray } from "lodash";

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
    const { roomName, memberEmails }: { roomName: string, memberEmails: string[] } | { [key: string]: undefined } = await req.json();
    const databaseEvents: DatabaseEvents = cache.get("db-events", new DatabaseEvents());
    if (!roomName || !isArray(memberEmails)) return new Response("Missing body", { status: 400 });
    try {
        await prisma?.room.create({
            data: {
                name: roomName,
                members: {
                    connect: memberEmails.map(email => {
                        return {
                            email
                        }
                    })
                }
            }
        })
    } catch (error) {
        console.log(error)
        return new Response("Error", { status: 500 });
    }
    databaseEvents.check();
    return new Response("Success", { status: 201 });
}