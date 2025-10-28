import { geCollaborators, removeCollaborators } from "@/lib/actions/create-room"
import { useOthers, useSelf } from "@liveblocks/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import ViewManager from "../ViewManager"
import { Button } from "../ui/button"
import { roomStore } from "@/lib/store/roomStore"
import ChangeAccess from "../changeUserType"
import { Avatar } from "../Avatar"
import { useLoading } from "@/utils/LoadingContext"
import Loader from "../Loader"
import { Loader2 } from "lucide-react"

export default function ActiveCollaborators() {
    let others = useOthers()
    const ownerId = roomStore((s)=>s.roomOwner)
    const roomId = roomStore((s)=>s.roomId)
    const {loading , setLoading} = useLoading()
    const [collaborators , setCollaborators] = useState() 
    let self = useSelf()
    
    let onlineCollaborators = others.map((other) => other.info)
    useEffect(() => {
        getAllUsers()
    },[])
    let getAllUsers = async () => {
        let res =  await geCollaborators({roomId})
       if (res.status === 200) {
    
        setCollaborators(res.Collaborators)
       }
       
    }
    let handleRemove = async (userId)=>{
        setLoading("removing")
        let res = await removeCollaborators({email : userId,roomId})
        if (res.status === 200){
            setCollaborators((prev)=>{
               return  prev.filter((col)=>col.userId !== userId)
            })
        }
        setLoading(null)

    }
    
    return (
        <main className="flex flex-col gap-3.5">
                {collaborators?.map(({ id, userId, image, name,access }) => {
                    return <div key={id} className={`flex justify-between items-center ${id === self.info.id && "bg-gray-11"} py-2 rounded-lg`}>

                        <div className="flex gap-2 items-center">
                            <div className="rounded-full relative shrink-0  size-10 overflow-hidden ">
                                {image ? 
                                <Image src={image} alt="collaborator-image" height={100} width={100} />
                            : <Avatar name={name && name[0]} />
                            }
                            </div>
                            <div className="flex item-center flex-col ">
                                <span className="font-medium">{name}</span>
                                <span className="text-gray-2 text-[0.9rem]">{userId}</span>
                            </div>
                        </div>

                        <div className="flex relative gap-1.5 items-center">
                            {
                                (self?.info?.id !== id && ownerId === self?.info?.id ) &&
                                <div className="flex gap-1 items-center ">
                            <ChangeAccess email={userId} access={access}/>

                            <Button onClick={()=>handleRemove(userId)} disabled={loading === "removing"} variant={"destructive"} >{
                        loading === "removing" ? <Loader2 className="animate-spin size-4" /> : "Remove"}</Button>
                                </div>
                            }
                            <div className="flex flex-col justify-center items-center">

                            {
                                id === ownerId && <span className="font-bold text-blue-400 text-[0.8rem]">Creator</span>
                            }
                            <div className="flex gap-1 items-center">

                                
                                  {(self?.info?.id !==  ownerId && id !== ownerId) && <span className="bg-gray-9 px-1 text-[0.9rem] rounded-md">{access}</span>}
                                  
                            {
                                id === self?.info?.id && <span className="text-[0.8rem] font-medium">You</span>
                            }
                            </div>
                            </div>

                        </div>
                    </div>
                  })}
        </main>
    )
}