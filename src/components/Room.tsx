import { useRooms } from '@/contexts/RoomsProvider'
import React, { useMemo } from 'react'
import RoomChat from './RoomChat';
import RoomActions from './RoomActions';
import RoomNavbar from './RoomNavbar';

const Room = () => {
  const rooms = useRooms()
  const subscribedRoom = useMemo(() => {
    return rooms.find(room => room.subscribed);
  }, [rooms]);
  if (!subscribedRoom) {
    return <div className='flex flex-col items-center justify-center w-full'>
      <h1 className='text-3xl font-bold text-gray-50'>No room selected</h1>
      <p className='text-palblack-500'>Select a room from the sidebar</p>
    </div>
  }
  return (
    <div className='flex flex-col w-full max-h-screen h-screen justify-between'>
      <RoomNavbar room={subscribedRoom} />
      <RoomChat room={subscribedRoom} />
      <RoomActions room={subscribedRoom} />
    </div>
  )
}


export default Room