'use client'
import ChatRoom from "@/component/Chat/ChatRoom";
import { useSession } from "next-auth/react";

export default function ChatPage(){
  
  return(
    <div>
      <ChatRoom roomId="1"/>
    </div>
  )
}