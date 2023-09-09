import { roomI } from '@/contexts/RoomsProvider'
import { messageT } from '@/pages/api/socketio'
import { useSession } from 'next-auth/react'
import React, { useEffect, useRef } from 'react'
interface Props {
  room: roomI
}
const RoomChat = ({ room }: Props) => {
  return (
    <div className='w-full max-h-full overflow-y-auto py-2 h-full flex flex-col gap-8'>
      {room.messages.map((message: messageT, index) => {
        return <Message message={message}
          key={index} />
      }
      )}
    </div>
  )
}
const Message = ({ message }: { message: messageT }) => {
  const { data } = useSession();
  const chatRef = useRef<HTMLDivElement>(null);
  const isMe = message.author.email === data?.user?.email;
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])
  return (
    <div className='grid grid-cols-2 grid-rows-1 w-full h-fit'
      ref={chatRef}>
      <div className={`${isMe ? "col-start-2 justify-self-end" : "col-start-1justify-self-start"} w-full max-w-md flex flex-col gap-2 px-2`}>
        <div className={`${isMe ? "flex-row-reverse" : "flex-row"} w-full flex justify-between items-center`}>
          <div className='text-palblack-50'>{isMe ? "You" : message.author.email}</div>
          <div className='text-palblack-600 text-sm'>{new Date(message.createdAt).toLocaleString()}</div>
        </div>
        <span className={`text-gray-50 rounded-md ${isMe ? "bg-palblue-500" : "bg-palblack-800"} mx-2 p-2`}>
          {message.content}
        </span>
      </div>
    </div>
  )
}

export default RoomChat