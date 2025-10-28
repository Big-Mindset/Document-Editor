"use client"

import { cn } from "@/lib/utils"
import { useThreads } from "@liveblocks/react"
import { useIsThreadActive } from "@liveblocks/react-lexical"
import { Composer, Thread } from "@liveblocks/react-ui"

function ThreadWrapper({thread}){
  
    const isAvtive = useIsThreadActive(thread.id)
    return (
        <Thread 
        thread={thread}
        data-state={isAvtive ? "active" : null}
        className={cn(thread.resolved && " opacity-45")}
        />
    )
}

export default function Comments(){
    const {threads} = useThreads()
    return (
        <div className="w-[400px]   scroll-y-auto">
            <Composer />
            {threads?.map((thread)=>{
                return <ThreadWrapper key={thread.id} thread={thread}  />
            })}
        </div>
    )
}