"use client"
import { useState, useContext, createContext, ReactNode, useEffect } from "react"
import type { memberT, messageT, roomT } from "@/pages/api/socketio";
import { useSocket } from "./SocketProvider";
import { useSession } from "next-auth/react";
export interface ExtendedMember extends memberT {
  remove: () => void
}
export interface roomI extends Omit<roomT, "members"> {
  subscribed: boolean;
  delete: () => void;
  rename: (newName: string) => void;
  addMember: (memberEmail: string) => void,
  sendMessage: (message: string) => void,
  subscribe: () => void,
  unsubscribe: () => void,
  members: ExtendedMember[]
}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Array<T> {
    createRoom(roomName: string): void
  }
}

const defaultRoomsContext: roomI[] = (() => {
  const arrWithCreateRoom: roomI[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrWithCreateRoom.createRoom = (roomName: string) => { };
  return arrWithCreateRoom;
})()
const RoomsContext = createContext(defaultRoomsContext);
export const useRooms = () => useContext(RoomsContext);
interface Props {
  children: ReactNode;
}


export const RoomsProvider = ({ children }: Props) => {
  const { status: authStatus, data: browserUser } = useSession();
  const [rooms, setRooms] = useState<roomI[]>(() => {
    const arrWithCreateRoom: roomI[] = [];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    arrWithCreateRoom.createRoom = (roomName: string) => {
      socket?.emit("room-create", roomName)
    };
    return arrWithCreateRoom;
  });
  const socket = useSocket()
  useEffect(() => {
    if (!socket) return;
    //#region populate functions
    const populateMember = (roomId: number, member: memberT): ExtendedMember => {
      return {
        ...member,
        remove() {
          removeMemberFromRoom(roomId, member.email!)
        },
      }
    }
    const populateRoom = (room: roomT): roomI => {
      return {
        ...room,
        subscribed: false,
        rename(newName) {
          renameRoom(room.id, newName);
        },
        delete() {
          deleteRoom(room.id)
        },
        addMember(memberEmail) {
          addMemberToRoom(room.id, memberEmail)
        },
        sendMessage(message) {
          sendMessageToRoom(room.id, message);
        },
        subscribe() {
          subscribeRoom(room.id);
        },
        unsubscribe() {
          unsubscribeRoom(room.id);
        },
        members: room.members.map(member => {
          return populateMember(room.id, member)
        })
      }
    }
    const subscribeRoom = (roomId: number) => {
      socket.emit("subscribe-room", roomId);
    };
    const unsubscribeRoom = (roomId: number) => {
      socket.emit("unsubscribe-room", roomId);
    };
    const renameRoom = (roomId: number, newName: string) => {
      socket.emit("room-rename", roomId, newName)
    }
    const deleteRoom = (roomId: number) => {
      socket.emit("room-delete", roomId)
    }
    const addMemberToRoom = (roomId: number, memberEmail: string) => {
      socket.emit("room-add-member", roomId, memberEmail)
    }
    const removeMemberFromRoom = (roomId: number, memberEmail: string) => {
      socket.emit("room-remove-member", roomId, memberEmail)
    }
    const sendMessageToRoom = (roomId: number, message: string) => {
      socket.emit("send-message", roomId, message)
    }
    //#endregion
    //#region socket listeners
    /**
     * Updates subscribed status of room
     * @param subscribed 
     * @param roomId 
     */
    function isSubscribed(subscribed: boolean, roomId: number) {
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return { ...r, subscribed };
          return r;
        });
      }
      );
    }
    function roomRename(newName: string, roomId: number) {
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return { ...r, name: newName };
          return r;
        });
      });
    }
    function newMessage(message: messageT, roomId: number) {
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return { ...r, messages: [...r.messages, message] };
          return r;
        });
      });
    }
    function roomAddMember(member: memberT, roomId: number) {
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return { ...r, members: [...r.members, populateMember(r.id, member)] };
          return r;
        });
      });
    }
    /**
     * Removes member from room or removes room
     * if client is the removed member, removes room from rooms
     * @param memberEmail newly removed email
     * @param roomId 
     */
    function roomRemoveMember(memberEmail: string, roomId: number) {
      if (memberEmail === browserUser?.user?.email) return deleteRoom(roomId);
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return { ...r, members: r.members.filter(m => m.email !== memberEmail) };
          return r;
        });
      });
    }
    function roomsAllSet(rooms: roomT[]) {
      const populatedRooms: roomI[] = [];
      populatedRooms.createRoom = (roomName: string) => {
        socket!.emit("room-create", roomName);
      };
      for (const room of rooms) populatedRooms.push(populateRoom(room));
      setRooms(populatedRooms);
    }
    function roomRemove(roomId: number) {
      const room = rooms.find(r => r.id === roomId);
      if (room?.subscribed) unsubscribeRoom(roomId);
      setRooms((prevRooms) => {
        return prevRooms.filter(r => r.id !== roomId);
      });
    }
    function roomAdd(room: roomT) {
      setRooms((prevRooms) => {
        return [...prevRooms, populateRoom(room)];
      });
    }
    /**
     * Overwrites room with new data
     * @param room new room data
     * @param roomId room id
     */
    function roomUpdate(room: roomT, roomId: number) {
      setRooms((prevRooms) => {
        return prevRooms.map(r => {
          if (r.id === roomId) return populateRoom(room);
          return r;
        });
      });
    }
    //#endregion
    socket.on("is-subscribed", isSubscribed);
    socket.on("room-rename", roomRename)
    socket.on("new-message", newMessage)
    socket.on("room-add-member", roomAddMember)
    socket.on("room-remove-member", roomRemoveMember)
    socket.on("rooms-data", roomsAllSet)
    socket.on("room-remove", roomRemove);
    socket.on("room-add", roomAdd);
    socket.on("room-update", roomUpdate)
    socket.emit("get-rooms");
    return () => {
      socket.off("is-subscribed", isSubscribed);
      socket.off("room-rename", roomRename)
      socket.off("new-message", newMessage)
      socket.off("room-add-member", roomAddMember)
      socket.off("room-remove-member", roomRemoveMember)
      socket.off("rooms-data", roomsAllSet)
      socket.off("room-remove", roomRemove);
      socket.off("room-add", roomAdd);
      socket.off("room-update", roomUpdate)
    }
  }, [socket]);

  if (authStatus === "loading") return children;
  if (!socket) return children;
  return (
    <RoomsContext.Provider value={rooms}>
      {children}
    </RoomsContext.Provider>
  );
};