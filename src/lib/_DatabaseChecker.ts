import { Prisma } from "@prisma/client";
import prisma from "./prisma";
import isEqual from 'lodash/isEqual'
import { EventEmitter } from "stream";
import { difference } from "lodash";
export type userT = Prisma.UserGetPayload<{
    select: {
        email: true,
        id: true,
        emailVerified: true,
        rooms: {
            select: {
                id: true
            }
        }
    }
}>

/**
 *  @description Checks for changes in db (when manipulatig with db the check function is called)
 *  * Emitted events
 * 
 *  * 'user-change-{userId}': (user:userT) => void;
 * 
 *  * 'user-{email}-room-change': (room:roomT) => void;
 * 
 *  * 'user-{email}-room-remove': (room:roomT) => void; Fired when room is deleted or user is removed
 * 
 *  * 'user-{email}-room-add': (room:roomT) => void;
*/
export class DatabaseEvents extends EventEmitter {
    private usersRecord: userT[] = [];
    private roomsRecord: roomT[] = [];
    constructor() {
        super()
        this.check()
    }
    public async check() {
        const dbUsers: userT[] = await prisma.user.findMany({
            select: {
                email: true,
                id: true,
                emailVerified: true,
                rooms: {
                    select: {
                        id: true
                    }
                }
            }
        })
        const dbRooms: roomT[] = await prisma.room.findMany({
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
        })
        if (!isEqual(this.usersRecord, dbUsers)) {
            this.usersRecord.forEach(user => {
                const dbUser = dbUsers.find(u => u.id === user.id);
                if (!isEqual(user, dbUser)) {
                    // User change
                    this.emit(`user-change-${user.id}`, dbUser)
                }
            });
            this.usersRecord = dbUsers;
        }
        if (!isEqual(this.roomsRecord, dbRooms)) {
            // Find deleted rooms
            for (const deletedRoom of difference(this.roomsRecord, dbRooms)) for (const member of deletedRoom.members) this.emit(`user-${member.email}-room-add`, deletedRoom)
            for (const createdRoom of difference(dbRooms, this.roomsRecord)) for (const member of createdRoom.members) this.emit(`user-${member.email}-room-remove`, createdRoom);
            for (const dbRoom of dbRooms) {
                const localRoom = this.roomsRecord.find(r => r.id === dbRoom.id);
                if (!localRoom) continue;
                if (!isEqual(dbRoom, localRoom)) {
                    for (const removedMembers of difference(localRoom.members, dbRoom.members)) this.emit(`user-${removedMembers.email}-room-remove`, dbRoom)
                    for (const addedMember of difference(dbRoom.members, localRoom.members)) this.emit(`user-${addedMember.email}-room-add`, dbRoom);
                    for (const user of dbRoom.members) this.emit(`user-${user.email}-room-change`, dbRoom);
                }
            }
            this.roomsRecord = dbRooms;
        }
    }
}
