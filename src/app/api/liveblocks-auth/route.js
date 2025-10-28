import { auth } from "@/lib/auth";
import { liveblocks } from "@/lib/liveblocks";
import { redirect } from "next/navigation";



export async function POST(request) {

  // Get the current user from your database
  const {user} = await auth.api.getSession({headers : request.headers})
  if (!user) return redirect("/auth/login")
    let info = {
        id : user.id,
        name : user.name,
        image : user.image,
        email : user.email
      }
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.email,
       groupIds : []
    },
    { userInfo: info },
  );
  

  return new Response(body, { status });
}