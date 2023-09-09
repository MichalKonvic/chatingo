"use client";

import React, { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { RoomsProvider } from "@/contexts/RoomsProvider";
import { SocketProvider } from "@/contexts/SocketProvider";
interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  return <SessionProvider>
    <SocketProvider>
      <RoomsProvider>
        {children}
      </RoomsProvider>
    </SocketProvider>
  </SessionProvider>;
};

export default Providers;