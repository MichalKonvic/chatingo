"use client"
import LogoutRedirect from '@/components/LogoutRedirect'
import Sidebar from '@/components/Sidebar';
// import Sidebar from '@/components/Sidebar'
import { useRooms } from '@/contexts/RoomsProvider'
import { messageT } from '@/pages/api/socketio';
import { signOut } from 'next-auth/react';
import { useId, useRef, useState } from 'react';
function App() {
    const rooms = useRooms();
    return (
        <main className=" min-h-screen min-w-full">
            {/* <Sidebar /> */}
            <button onClick={() => signOut()}>Logout</button>
            <button onClick={() => rooms.createRoom(new Date().getTime().toString())}>Create room</button>
            {rooms.map(room => {
                return (
                    <div key={room.id}>
                        <h1>Room:{room.name}</h1>
                        <h2>Subscribed:{room.subscribed ? "true" : "false"}</h2>
                        <button onClick={() => room.subscribe()}>Subscribe</button>
                        <button onClick={() => room.unsubscribe()}>Unsubscribe</button>
                        <h2>Members:</h2>
                        <ul>
                            {room.members.map(member => {
                                return (
                                    <li key={member.id}>{member.email} <button onClick={member.remove}>Remove</button></li>
                                )
                            })}
                        </ul>
                        <h2>Messages:</h2>
                        <ul>
                            {room.messages.map((message, i) =>
                                <Message key={i}
                                    message={message} />
                            )}
                        </ul>
                        <Chat sendMessage={room.sendMessage} />
                        <MemberMenu addMember={room.addMember} />
                        <button onClick={() => room.delete()}>Delete room</button>
                    </div>
                )
            })}
        </main>
    )
}
const Message = ({ message }: { message: messageT }) => {
    const id = useId()
    return (
        <li key={id}>{message.author.email}:{message.content}</li>
    )
}

const Chat = ({ sendMessage }: {
    sendMessage: (message: string) => void
}) => {
    const [message, setMessage] = useState<string>("")
    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            sendMessage(message)
        }}>
            <input
                className='text-black'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                name="message-input"
                id="input"
            />
            <input type="submit"
                value="Send" />
        </form>
    )
}
const MemberMenu = ({ addMember }: { addMember: (email: string) => void }) => {
    const memberNameRef = useRef<HTMLInputElement>(null)
    return (
        <div>
            <h1>Member Add</h1>
            <input type="text"
                ref={memberNameRef}
                name="memberEmail"
                id="" />
            <button onClick={() => {
                if (memberNameRef.current) {
                    addMember(memberNameRef.current.value)
                }
            }}>Add</button>
        </div>
    )
}




export default function Home() {
    return <LogoutRedirect>
        <App />
    </LogoutRedirect>
}
