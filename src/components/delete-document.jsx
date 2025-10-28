"use client"

import { Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { useLoading } from "@/utils/LoadingContext"
import { roomStore } from "@/lib/store/roomStore"
import { deleteDocument } from "@/lib/actions/create-room"
import { useRouter } from "next/navigation"

export const DeleteDocument =  ()=>{
    let roomId = roomStore((s)=>s.roomId)
    let router = useRouter()
    let {loading , setLoading} = useLoading()
    let handleDelete = async ()=>{
        setLoading("delete")
        let res = await deleteDocument({roomId})
        if (res?.status === 200) router.push("/")
        setLoading(null)
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div  className="p-2 flex text-red-100 hover:bg-red-500/20 cursor-pointer gap-1.5 items-center bg-red-500/10 rounded-lg">
                            <Trash size={14}/>
                            <span>Delete</span>

                </div>
            </DialogTrigger>
            
            <DialogContent>
                
                   <DialogHeader>
                    <DialogTitle className={"text-red-300"}>
                        Delete Document 
                    </DialogTitle>
                    <DialogDescription>
                        Once the document is deleted you will not be access it again
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>

                    <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleDelete} disabled={loading === "delete"} variant={"destructive"}>{loading === "delete" ? "deleting..." : "delete"} </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}