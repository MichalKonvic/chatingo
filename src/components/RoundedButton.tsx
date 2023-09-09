'use client'
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import React from "react";
interface IChatButton {
  children?: ReactNode,
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown
}
export default function RoundedButton({ children, onClick }: IChatButton) {
  const { status: authState } = useSession();
  if (authState === "loading") {
    return (
      <button className="animate-pulse w-12 h-12 rounded-full bg-palblack-800">
      </button>
    )
  }
  return (
    <button onClick={onClick}
      className="w-12 h-12 rounded-full bg-palblack-800 text-palblack-50 hover:text-white hover:bg-palblack-700 fill-current flex items-center justify-center">
      {children}
    </button>
  )
}