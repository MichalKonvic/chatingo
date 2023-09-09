'use client'
import ProfileButton from '@/components/ProfileButton'
import React, { useState } from 'react'
import RoundedButton from './RoundedButton'
import { useRooms } from '@/contexts/RoomsProvider'
import CreateRoomForm from './CreateRoomForm'
import ChatButton from './ChatButton'
const Sidebar = () => {
  return (
    <div className='min-h-screen w-24 bg-palblack-900 py-8 flex flex-col items-center justify-between'>
      <ChatButtons />
      <ProfileButton />
    </div >
  )
}


const ChatButtons = () => {
  const rooms = useRooms();
  const [showRoomCreation, setRoomCreation] = useState(false);
  return (
    <div className='flex flex-col gap-2'>
      {showRoomCreation && <CreateRoomForm
        closeForm={() => setRoomCreation(false)}
        onRoomCreated={() => setRoomCreation(false)} />}
      {rooms.map(room => {
        return <ChatButton room={room}
          key={room.id} />
      })}
      <RoundedButton onClick={() => setRoomCreation(true)}>
        <svg xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="feather feather-plus"><line x1={12}
            y1={5}
            x2={12}
            y2={19} /><line x1={5}
              y1={12}
              x2={19}
              y2={12} /></svg>
      </RoundedButton>
    </div>
  )
}

export default Sidebar