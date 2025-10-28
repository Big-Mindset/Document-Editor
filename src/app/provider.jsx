"use client";

import Loader from "@/components/Loader";
import { getDocumentUsers } from "@/lib/actions/create-room";
import { getUsers } from "@/lib/actions/get-resolvedUsers";
import { authClient } from "@/lib/auth-client";
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";



export default function LiveBlocksProvider({children}) {
  let {data} = authClient.useSession()
  return (
    <LiveblocksProvider resolveUsers={async  ({userIds})=>{
      let users = await getUsers({userIds})
      
      return users
    }} authEndpoint={"/api/liveblocks-auth"} resolveMentionSuggestions={async ({text , roomId})=>{
      let users = await getDocumentUsers(roomId,data.user.email,text)
      return users || []
    }}>
        <ClientSideSuspense fallback={<Loader />}>
          {children}
        </ClientSideSuspense>
    </LiveblocksProvider>
  )
}