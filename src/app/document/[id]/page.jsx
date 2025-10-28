

import Navbar from "../_components/Navbar";
import Editor from "@/components/editor/Editor";
import { RoomDebug } from "@/components/editor/plugins/RoomDebug";
import CollaborativeRoom from "@/components/live-blocks-comp/collaborative-room";
import SetRoomId from "@/components/live-blocks-comp/SetRoomId";
import { getDocument } from "@/lib/actions/create-room";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma-client";
import { roomStore } from "@/lib/store/roomStore";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Document({params}){
    let {id} = await params
    let session = await auth.api.getSession({headers : await headers()})
    if (!session)  redirect("/auth/login")
    const getRoom = await getDocument(session.user.email,id)
   
    
    let userIds = Object.keys(getRoom?.usersAccesses)
    let users ;
    if (userIds){

         users = await prisma.user.findMany({
            where : { 
                id : {
                    in : userIds
                },
                
        },
        select : {
            email : true
        }
    })
}
    let Otherusers = users?.map((user)=>({
        ...user , userType : getRoom.usersAccesses[user.email]?.includes("room:write") ? "editor" : "viewer"
    }))
    const currectUser = getRoom?.usersAccesses[session.user.email]?.includes("room:write")  ? "editor" : "viewer"
    if (!getRoom) redirect("/")

    return (

        <>
    
              <SetRoomId roomData={JSON.parse(JSON.stringify({
                id : getRoom.id,
                ownerId : getRoom.metadata.creatorId
              }))}  
              roomMetadata={JSON.parse(JSON.stringify(getRoom.metadata)) }
              />
            <CollaborativeRoom  roomId={getRoom.id} >
        <div className="flex flex-col relative overflow-hidden  h-dvh   ">
            <Navbar   />
        
            <Editor users={Otherusers} currentUser={currectUser}  />
            
        </div>
            </CollaborativeRoom>
            </>
    )
}