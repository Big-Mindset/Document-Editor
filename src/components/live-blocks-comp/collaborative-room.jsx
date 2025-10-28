"use client"

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

export default function CollaborativeRoom({children,roomId}){
  console.log(roomId);
  
    return (
         <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    )
}