'use client'

import UserCard from "@/component/Profile/UserCard";
import { IUser } from "@/interface";
import getAllUser from "@/libs/admin/getAllUser";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";


export default function AdminUserPage(){
  const { data:session } = useSession();
  const [allUserData, setAllUserData] = useState<IUser[]>();

  useEffect(()=>{
    async function GetAllUser() {
      if(!session) return;
      try{
        const res = await getAllUser(session?.user.token)
        setAllUserData(res.data);
      }catch(err){
        console.log("Error", err);
      }
    }
    GetAllUser()
  },[])

  console.log(allUserData);
  
  return(
    <div className="m-10 flex flex-col gap-5">
      {allUserData && allUserData?.map((user) => (
        <UserCard key={user._id} session={user}/>
      ))}
    </div>
  )
}