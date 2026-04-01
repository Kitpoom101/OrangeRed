'use client'
import ChatBox from "@/component/Chat/ChatBox";
import { useSession } from "next-auth/react";

export default function ChatPage(){
  
  return(
    <div>
      <ChatBox roomId="1"/>
    </div>
  )
}