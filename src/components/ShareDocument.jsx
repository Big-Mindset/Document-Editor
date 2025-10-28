"use client"

import { Eye, Loader2, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { useState } from "react";
import { Input } from "./ui/input";
import ViewManager from "./ViewManager";
// import { liveblocks } from "@/lib/liveblocks";
import { useLoading } from "@/utils/LoadingContext";
import Loader from "./Loader";
import { updateUserAccess } from "@/lib/actions/create-room";
import { toast } from "sonner";
import ActiveCollaborators from "./live-blocks-comp/acive-collaborators";
import { roomStore } from "@/lib/store/roomStore";
import { useSelf } from "@liveblocks/react";

export function ShareDocument() {
    const roomId = roomStore((s) => s.roomId)
    const ownerId = roomStore((s) => s.roomOwner)
    let self = useSelf()
    const { loading, setLoading } = useLoading()
    const [email, setEmail] = useState("")
    const [userType, setUsertype] = useState("view")

    let handleInvite = async () => {
        if (!email) return 
        setLoading("invite")
        let res = await updateUserAccess({ roomId, access: userType, email })
       
        if (res.status === 400) {
            toast.error(res.message)
        }
        setLoading(null)
    }
    return (
        <Dialog >
            <DialogTrigger asChild>

                <Button className="flex gap-1 items-center" variant="default">
                    {self?.info?.id === ownerId ? 
                    <>

                    <Share2 size={18} />
                    <span>Share</span>
                    </>
                : 
                <>
                <Eye />
                <span>View</span>
                </>

                }
                </Button>
            </DialogTrigger>

            <DialogContent className={"space-y-2"}>
                <DialogHeader>
                    <DialogTitle>
                        {self?.info?.id === ownerId ? "Share with your friends" : "All Collaborators"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                        {self?.info?.id === ownerId &&
                    <div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <div className="flex gap-2.5 items-center py-1.5">
                                <div className="flex flex-1  rounded-md">
                                    <Input id="email" placeholder="Enter the email" className="border-none  focus-visible:ring-0 focus-visible:ring-offset-0 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <ViewManager userType={userType} setUserType={setUsertype} />
                            </div>
                        </div>
                        <Button onClick={handleInvite} disabled={loading === "invite" || !email} variant={"outline"} className={"w-full mt-2"} >{
                            loading === "invite" ? <Loader2 className="animate-spin size-4" /> : "Invite"
                        }</Button>
                    </div>  
                    }
                    <ActiveCollaborators />

                </div>

            </DialogContent>

        </Dialog>
    )
}