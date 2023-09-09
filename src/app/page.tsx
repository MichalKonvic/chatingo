"use client"
import LogoutRedirect from '@/components/LogoutRedirect'
import Room from '@/components/Room';
import Sidebar from '@/components/Sidebar';
import { useSocket } from '@/contexts/SocketProvider';
import { useEffect } from 'react';
function App() {
  const socket = useSocket()
  useEffect(() => {
    if (!socket) return;
    socket?.on("user-error", (err: string) => { console.log(err) });
    return () => {
      socket.off("user-error")
    }
  }, [socket])
  return (
    <main className="min-h-screen min-w-full flex">
      <Sidebar />
      <Room />
    </main>
  )
}


export default function Home() {
  return <LogoutRedirect>
    <App />
  </LogoutRedirect>
}
