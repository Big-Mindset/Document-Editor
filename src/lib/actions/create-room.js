"use server"

import { revalidatePath } from "next/cache";
import { liveblocks } from "../liveblocks";
import { auth } from "../auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../prisma-client";

export async function CreateRoom({ userId, email }) {
    let roomId = crypto.randomUUID()
    try {
        let usersAccesses = {
            [email]: ['room:write']
        }
        const room = await liveblocks.createRoom(roomId, {
            usersAccesses,
            metadata: {
                creatorId: userId,
                email,
                title: "Untitled"
            },
            defaultAccesses: []
        });
        revalidatePath("/")
        return room
    } catch (error) {
        console.log("Error creating the room")
        console.log(error.message)
    }

}

export async function getDocument(email, roomId) {
    try {

        let room = await liveblocks.getRoom(roomId)

        if (!room){

            redirect("/")
        }

        let hasAccess = Object.keys(room.usersAccesses).includes(email)
        if (!hasAccess) {
            throw new Error("You have not access to this document")
        }
        return room
    } catch (error) {

        console.log("Error getting the document");
        if (error.status === 404 ){
            redirect("/")
        }

    }
}
export async function updateDocument(roomId, title) {
    try {
        console.log(roomId , title);
        
        let updateRoom = await liveblocks.updateRoom(roomId, {
            metadata: {
                title
            }
        })
        console.log(updateRoom);
        
        // revalidatePath(`/document/${roomId}`)
        return updateRoom
    } catch (error) {
        console.log(error.message);

    }
}

export async function getDocuments(email) {
    try {

        let rooms = await liveblocks.getRooms({ userId: email })

        return rooms
    } catch (error) {

        console.log("Error getting while getting rooms");
        console.log(error.message);

    }
}

export async function getDocumentUsers(roomId, currentUser, text) {
    try {
        if (!text.length) return
        let room = await liveblocks.getRoom(roomId)
        const users = Object.keys(room.usersAccesses).filter(email => email !== currentUser)
        const lowercaseText = text.toLowerCase()
        let filteredUsers = users.filter(email => email.includes(lowercaseText))
        return filteredUsers


    } catch (error) {
        console.log("error in get document");
        console.log(error.message);

    }
}
export async function updateUserAccess({ roomId, email, access }) {
   
    try {
        let session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            redirect("/auth/login")
        }
        let isExist = await prisma.user.findUnique({
            where : {
                email 
            },
            select : {
                id : true
            }
        })
        if (!isExist){
            return { status: 400, message: "User does not exist" }
        }
        
        let myId = session.user.email

        if (!access || !email || !roomId) return { status: 400, message: "Invalid data sent to the server try again" }
        if (myId === email) return { status: 400, message: "Cannot invite yourself" }
        let res = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: access === "edit" ? ["room:write" ]: ["room:read", "room:presence:write"]
            }
        })
        console.log(res);
        
        return { status: 200, message: "User added to the document" }
    } catch (error) {
        console.log("error in updating  document");
        console.log(error.message);
    }
}
export async function removeCollaborators({  email,roomId }) {
    console.log(email , roomId);
    
    try {
        let session = await auth.api.getSession({ headers: await headers() })
        if (!session) {
            redirect("/auth/login")
        }
   
        
        let res = await liveblocks.updateRoom(roomId, {
            usersAccesses: {
                [email]: null
            }
        })
        
        return { status: 200, message: "User removed" }
    } catch (error) {
        console.log("error in removing  user");
        console.log(error.message);
    }
}

export async function geCollaborators({ roomId }) {
    try {
        let room = await liveblocks.getRoom(roomId)
        const usersWithAccess = Object.entries(room.usersAccesses || {}).map(([userId, permissions]) => ({
            userId: userId,
            permissions: permissions,
            access: permissions.includes("room:write") ? "editor" : "viewer"
        }));
        let promises = usersWithAccess.map((collaborator) => {
            return prisma.user.findUnique({
                where: {
                    email: collaborator.userId,
                },
                select: {
                    name: true,
                    image: true,
                    id : true

                }
            })
        })
        let userData = await Promise.all(promises)
        const enrichedCollaborators = usersWithAccess.map((collab, index) => ({
            ...collab,
            name: userData[index]?.name || null,
            image: userData[index]?.image || null,
            id : userData[index]?.id
        }));
        return { status: 200, Collaborators: enrichedCollaborators }
    } catch (error) {
        console.log("error in getCollaborators");
        console.log(error)

    }
}

export const deleteDocument = async ({roomId})=>{
    try {
        await liveblocks.deleteRoom(roomId)
        return {status : 200 , message : "Document deleted successfully"}
    } catch (error) {
        console.log("Error in deleting document");
        console.log(error.message);
        
        
    }
}