"use client"
import { useContext, createContext, ReactNode, useEffect, /*useState*/ } from "react"
import useSocketHook from "@/hooks/useSocket";
import { Socket } from "socket.io-client";
// import ReEventEmitter from "@/utils/EventEmitter";
import { useSession } from "next-auth/react";

const defaultSocketContext: Socket | null = null;
const SocketContext = createContext<Socket | null>(defaultSocketContext);
export const useSocket = () => useContext(SocketContext);
// export const useSocket = (handler?: (socket: ReEventEmitter) => void) => {
//   const socket = useContext(SocketContext);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [emits, setEmits] = useState<{ event: string, data: any[] }[]>();
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const reEmitToSocket = (event: string, ...data: any[]) => {
//     setEmits((prev) => {
//       if (!prev) return [{ event, data }];
//       return [...prev, { event, data }]
//     })
//   }
//   const eventEmitter = new ReEventEmitter(reEmitToSocket);
//   const reEmit = (event: string, ...args: unknown[]) => {
//     eventEmitter._reEmit(event, ...args);
//   }
//   useEffect(() => {
//     if (!socket) return;
//     if (!emits) return;
//     emits.forEach(({ event, data }) => {
//       socket?.emit(event, ...data);
//     })
//   }, [emits, socket])
//   useEffect(() => {
//     if (!socket) return;
//     socket.onAny(reEmit)
//     handler && handler(eventEmitter);
//     return () => {
//       socket.offAny(reEmit);
//     }
//   }, [socket])
//   return eventEmitter;
// };
interface Props {
  children: ReactNode
}
export const SocketProvider = ({ children }: Props) => {
  const { data, status } = useSession();
  const { socket, connectSocket } = useSocketHook();
  useEffect(() => {
    if (status !== "authenticated") return;
    connectSocket();
  }, [data?.user?.email, status])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}