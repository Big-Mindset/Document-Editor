
import {create} from "zustand"
export let roomStore = create((set)=>({
    roomId : "",
    roomOwner : "",
    setRoomId : ((id)=>set({roomId : id})),
    setOwnerId : ((id)=>set({roomOwner : id})),
    metadata : null,
    setMedata : (data)=>set({metadata : data})
}))