"use client"
import { useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
/**
 * Socket.io hook 
 * @param handler is called when socket is connected
 * 
 * Removes all listeners on **unmount**
 */
export default function useSocket(handler?: (socket: Socket) => void) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const connectSocket = () => {
        fetch('/api/socketio').finally(() => {
            const ioSocket = io();
            ioSocket.once("connect", () => {
                setSocket(ioSocket);
            }
            )
        })
    }
    useEffect(() => {
        if (!socket) return;
        handler && handler(socket)
        return () => {
            socket?.removeAllListeners();
            socket?.close();
        }
    }, [socket])
    return { socket, connectSocket }
}