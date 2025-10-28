"use client"

import { roomStore } from "@/lib/store/roomStore";
import { useEffect } from "react";

export default function SetRoomId({roomData,roomMetadata}){
  
    const setRoomId = roomStore((s) => s.setRoomId);
  const setOwnerId = roomStore((s) => s.setOwnerId);
   const setMedata = roomStore((s)=>s.setMedata)
  useEffect(()=>{
    
    setRoomId(roomData.id)
    setOwnerId(roomData.ownerId)
    setMedata(roomMetadata)
  },[roomData,roomMetadata,setRoomId,setOwnerId,setMedata])
  
    return null
}