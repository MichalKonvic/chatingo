import React from 'react'
import RoundedButton from './RoundedButton'
import { roomI, useRooms } from '@/contexts/RoomsProvider'
interface Props {
  room: roomI
}
const ChatButton = ({ room }: Props) => {
  const rooms = useRooms()
  return (
    <div className={`group relative`}
      onClick={() => {
        for (const roomsRoom of rooms) {
          if (roomsRoom.id == room.id) {
            roomsRoom.subscribe()
            continue;
          }
          roomsRoom.unsubscribe()
        }
      }}>
      <RoundedButton >
        {room.name[0]}
      </RoundedButton >
      <span
        className="bg-palblack-50 text-palblack-800 pointer-events-none absolute -top-7 left-8 rounded-sm px-1 py-[2px] w-max opacity-0 transition-opacity group-hover:opacity-100"
      >
        {room.name}
      </span>
    </div>
  )
}

export default ChatButton