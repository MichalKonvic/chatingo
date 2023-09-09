import { FormEvent, useEffect, useRef, useState } from "react";
import { memberT, roomT } from "@/pages/api/socketio";
import { useSocket } from "@/contexts/SocketProvider";
import DropdownPicker, { DropdownItem } from "./DropdownPicker";
import useClickOutside from "@/hooks/useClickOutside";
import { useSession } from "next-auth/react";
interface Props {
  onRoomCreated?: (room: roomT) => void,
  closeForm?: () => void
}
export default function CreateRoomForm({ onRoomCreated, closeForm }: Props) {
  const { data } = useSession();
  const [newRoom, setNewRoom] = useState("");
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<DropdownItem<memberT>[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<DropdownItem<memberT>[]>([])
  const formRef = useRef<null | HTMLFormElement>(null);
  const membersToAdd = useRef<string[]>();

  useClickOutside([formRef], () => {
    closeForm && closeForm()
  });

  // Converts value from picker to membersToAdd ref 
  // so it can be used in socket emit
  useEffect(() => {
    membersToAdd.current = selectedUsers.map((selUser) => {
      const email = typeof selUser === "string" ? selUser : selUser.email!;
      return email;
    });
  }, [selectedUsers])

  // Adds user to room
  const handleRoomCreated = (createdRoom: roomT) => {
    membersToAdd.current?.forEach((email) => {
      socket?.emit("room-add-member", createdRoom.id, email);
    })
    onRoomCreated && onRoomCreated(createdRoom);
    setSelectedUsers([]);
    setNewRoom("")
    socket.emit("get-users");
    setLoading(false);
  }
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    setLoading(false)
    socket.emit("get-users");
    const handleUsersData = (members: memberT[]) => {
      members = members.filter((mem) => mem.email !== data?.user?.email);
      setUsers(members.map((mem): DropdownItem<memberT> => {
        return {
          ...mem,
          text: mem.email!,
        }
      }));
    }
    socket.on("users-data", handleUsersData)
    socket.on("room-add", handleRoomCreated)
    return () => {
      socket.off("users-data", handleUsersData)
      socket.off("room-add", handleRoomCreated)
    }
  }, [socket])
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true)
    socket!.emit("room-create", newRoom);
  }
  if (loading) return (
    <form
      key="loading-form"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-8 bg-palblack-900 rounded-lg flex flex-col gap-4">
      <input type="text"
        className="w-60 bg-palblack-700 outline-none border-palblack-200 border p-2 rounded-md flex items-center pointer-events-none animate-pulse"
        placeholder="   "
      />
      <input type="text"
        className="w-60 bg-palblack-700 outline-none border-palblack-200 border p-2 rounded-md flex items-center pointer-events-none animate-pulse"
        placeholder=" "
      />
      <input type="submit"
        className="w-60 bg-palblue-500 outline-none border-palblack-200 hover:border p-2 rounded-md flex items-center justify-center pointer-events-none animate-pulse"
        placeholder=" " />
    </form>
  )
  return (
    <form ref={formRef}
      onSubmit={handleSubmit}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-12 py-8 bg-palblack-900 rounded-lg flex flex-col gap-4">
      <input type="text"
        className="w-60 bg-palblack-700 outline-none border-palblack-200 border p-2 rounded-md flex items-center cursor-pointer"
        placeholder="Room name"
        name="room-name"
        id="roomName"
        value={newRoom}
        onChange={(e) => setNewRoom(e.target.value)}
      />
      <DropdownPicker
        placeholder="Select members"
        items={users}
        selectedItems={selectedUsers}
        setSelectedItems={setSelectedUsers}
      />
      <input type="submit"
        className="w-60 bg-palblue-500 outline-none border-palblack-200 hover:border p-2 rounded-md flex items-center justify-center cursor-pointer"
        value="Create Room" />
    </form>
  )
}