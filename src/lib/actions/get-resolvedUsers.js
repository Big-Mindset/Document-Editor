"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation"
import { prisma } from "../prisma-client"

export async function getUsers({userIds}){
    try {
      
        let {session} = await auth.api.getSession({headers : await headers()})
        if (!session) redirect("/auth/login")
            let users = await prisma.user.findMany({
        where : {
            email : {
                in :  userIds
            },
            
        },
        select : {
            name : true,
            image : true,
            email : true,
            id : true
        }
    })
    return users
} catch (error) {
    console.log(error);
       
}
}