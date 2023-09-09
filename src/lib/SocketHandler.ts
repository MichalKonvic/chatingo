import { roomT, messageT, memberT } from "@/pages/api/socketio";
import { Server } from "socket.io";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { getUserRooms } from "./DatabaseCalls";
import prisma from "./prisma";
import { getSession } from "next-auth/react";

export const onConnection = (io: Server) => {
    const emitToUser = (ev: string, email: string, ...args: any[]) => {
        io.to(email).emit(ev, ...args);
    }
    const emitToRoom = (ev: string, roomId: string, ...args: any[]) => {
        io.to(roomId).emit(ev, ...args);
    }
    const unsubscribeFromRoom = (email: string, roomId: string) => {
        io.in(email).socketsLeave(roomId);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (socket: Socket<DefaultEventsMap, DefaultEventsMap, any>) => {
        console.log(new Date().toLocaleTimeString() + ":User connect")
        const session = await getSession({
            req: socket.request
        })
        if (!session) {
            socket.emit("user-error", "You are not logged in");
            console.log(new Date().toTimeString() + ": User not logged in")
            socket.disconnect();
            return;
        }
        socket.join(session.user!.email!);
        // 1-1
        socket.on("get-rooms", async () => {
            const userRooms = await getUserRooms(session.user!.email!) as roomT[];
            socket.emit("rooms-data", userRooms ?? []);
        })
        socket.on("get-users", async () => {
            const members: memberT[] = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true
                }
            })
            socket.emit("users-data", members);
        })
        socket.on("subscribe-room", async (roomId: number) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            socket.join(roomId.toString());
            const room = await prisma.room.findUnique({
                where: {
                    id: roomId
                },
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
            });
            socket.emit("room-update", room as roomT, roomId);
            socket.emit("is-subscribed", true, roomId);
        });
        socket.on("unsubscribe-room", async (roomId: number) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            socket.leave(roomId.toString());
            socket.emit("is-subscribed", false, roomId);
        });
        socket.on("whoami", () => {
            socket.emit("whoami", session.user);
        })
        socket.on("is-subscribed", async (roomId: number) => {
            if (socket.rooms.has(roomId.toString())) socket.emit("is-subscribed", true, roomId);
            else socket.emit("is-subscribed", false, roomId);
        });
        // 1-many
        // without subscription 
        // (sends to all members)
        socket.on("room-rename", async (roomId: number, newName: string) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            const room = await prisma.room.update({
                where: {
                    id: roomId
                },
                data: {
                    name: newName
                },
                select: {
                    members: {
                        select: {
                            email: true
                        }
                    }
                }
            })
            for (const member of room.members) {
                emitToUser("room-rename", member.email!, newName, roomId);
            }
        })
        socket.on("room-add-member", async (roomId: number, email: string) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            const roomMembers = (await prisma.room.update({
                where: {
                    id: roomId
                },
                data: {
                    members: {
                        connect: {
                            email
                        }
                    }
                },
                select: {
                    members: {
                        select: {
                            email: true,
                            id: true
                        }
                    }
                }
            })).members;
            const newRoom = await prisma.room.findUnique({
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
                },
                where: {
                    id: roomId
                }
            });
            const newMember = roomMembers.find(m => m.email === email);
            for (const member of roomMembers) {
                if (member.email == email) emitToUser("room-add", email, newRoom as roomT);
                else emitToUser("room-add-member", member.email!, newMember as memberT, roomId);
            }
        });
        socket.on("room-remove-member", async (roomId: number, email: string) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            const room = await prisma.room.update({
                where: {
                    id: roomId
                },
                data: {
                    members: {
                        disconnect: {
                            email
                        }
                    }
                },
                select: {
                    members: {
                        select: {
                            email: true,
                        }
                    }
                }
            });
            // remove from room members
            io.in(email).emit("room-remove", roomId);
            for (const member of room.members) {
                if (member.email === email) {
                    emitToUser("room-remove", email, roomId);
                    unsubscribeFromRoom(email, roomId.toString());
                } else emitToUser("room-remove-member", member.email!, email, roomId);
            }
        });
        socket.on("room-delete", async (roomId: number) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            const room = await prisma.room.delete({
                where: {
                    id: roomId
                },
                select: {
                    members: {
                        select: {
                            email: true
                        }
                    }
                }
            });
            for (const member of room.members) {
                unsubscribeFromRoom(member.email!, roomId.toString());
                emitToUser("room-remove", member.email!, roomId)
            }
        });
        socket.on("room-create", async (name: string) => {
            const newRoom = await prisma.room.create({
                data: {
                    name,
                    members: {
                        connect: {
                            email: session.user!.email!
                        }
                    }
                },
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
            });
            for (const member of newRoom.members) {
                emitToUser("room-add", member.email!, newRoom as roomT)
            }
        });
        // with-subscription 
        // (sends to all members that are subscribed[are in scoket room])
        socket.on("send-message", async (roomId: number, message: string) => {
            if (!(await getUserRooms(session.user!.email!))?.some(r => r.id === roomId)) socket.emit("user-error", "You are not in this room")
            if (socket.rooms.has(roomId.toString()) === false) socket.emit("user-error", "You are not subscribed to this room")
            const dbMessage = await prisma.message.create({
                data: {
                    content: message,
                    author: {
                        connect: {
                            email: session.user!.email!
                        }
                    },
                    room: {
                        connect: {
                            id: roomId
                        }
                    }
                },
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
            });
            emitToRoom("new-message", roomId.toString(), dbMessage as messageT, roomId)
        });

        socket.on("disconnect", () => {
            console.log(new Date().toLocaleTimeString() + ":User disconnect")
        })
    }
}