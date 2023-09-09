import { ExtendedMember } from '@/contexts/RoomsProvider'
import { useSocket } from '@/contexts/SocketProvider'
import { memberT } from '@/pages/api/socketio'
import React, { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  members: ExtendedMember[],
  addMember: (email: string) => void
}

const RoomAddMember = ({ members, addMember }: Props) => {
  const [users, setUsers] = useState<memberT[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null)
  const memberHint = useMemo(() => {
    if (!memberSearch) return "";
    const result = users.filter(u => !members.some(m => m.email === u.email)).filter(availU => {
      return availU.email!.toLowerCase().startsWith(memberSearch.toLowerCase());
    })[0]?.email || "";
    if (memberSearch.length >= 15) return "";
    return result
  }, [users, members, memberSearch])
  const [toggleAdd, setToggleAdd] = useState(false);
  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    socket.emit("get-users");
    socket.on("users-data", setUsers)
  }, [socket])
  function handleMemberAdd(): void {
    addMember(memberSearch);
    setMemberSearch("");
    setToggleAdd(false);
    socket!.emit("get-users");
  }
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  if (!socket) {
    return <span
      className={`${toggleAdd && "hidden"} px-2 py-2 flex justify-between items-center w-full text-palblack-50 hover:bg-palblack-50/10 cursor-pointer`}>
    </span>
  }
  return <>
    <span onClick={() => setToggleAdd(true)}
      className={`${toggleAdd && "hidden"} px-2 py-2 flex justify-between items-center w-full text-palblack-50 hover:bg-palblack-50/10 cursor-pointer`}>Add member
      <svg xmlns="http://www.w3.org/2000/svg"
        className={`${toggleAdd && "hidden"} text-palblack-50 rounded-md`}
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"><line x1={12}
          y1={5}
          x2={12}
          y2={19} /><line x1={5}
            y1={12}
            x2={19}
            y2={12} /></svg>
    </span>
    <div className={`${!toggleAdd && "hidden"} bg-palblack-50/10 flex relative items-center px-2`}>
      <input
        value={memberHint}
        readOnly
        className='absolute text-palblack-50/60 bg-transparent w-36 pointer-events-none overflow-hidden' />
      <input type="text"
        ref={inputRef}
        id='memberSearch'
        placeholder='Add member'
        onChange={(e) => {
          setMemberSearch(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.key == "Tab" && memberHint != "") {
            setMemberSearch(memberHint)
          }
        }}
        value={memberSearch}
        className={`py-2 text-palblack-50 bg-transparent outline-none w-full z-20`}
        autoComplete="off" />
      <div className={`flex gap-2 z-50`}>
        <svg xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={handleMemberAdd}
          className="text-green-500 p-1 rounded-md bg-green-400/30 hover:bg-green-400/40 z-20"><polyline points="20 6 9 17 4 12" /></svg>
        <svg xmlns="http://www.w3.org/2000/svg"
          onClick={() => {
            setToggleAdd(false)
          }}
          className="text-red-500 p-1 rounded-md bg-red-400/30 hover:bg-red-400/40 z-20"
          height={24}
          viewBox="0 0 24 24"
          fill="currentColor"
          width={24}><path d="M0 0h24v24H0V0z"
            fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>
      </div>
    </div>
  </>
}

export default RoomAddMember