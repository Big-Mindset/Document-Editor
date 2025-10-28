"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client"
import { useLoading } from "@/utils/LoadingContext";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function VerificationEmail({email}) {
    let session = authClient.useSession()
    let {loading , setLoading} = useLoading()
    let [resetagain , setResendAgain] = useState()
    console.log(session);
    let handleResendVerificationEmail = async ()=>{
        setResendAgain(30)
        setLoading("verify-email")
        await authClient.sendVerificationEmail({
            email ,
        },{
            onError : (error)=>{
                toast.error(error.error.message)
            },
            onSuccess : ()=>{
                toast.success("Verification email sent")
            }
        })
        setLoading(null)


    }
    return (
        <div className="flex justify-center items-center w-full  h-dvh">
            <Card className="w-full max-w-[500px]">
                <CardHeader>
                    <CardTitle>
                        Verify your email
                    </CardTitle>
                    <CardDescription>
                        we have sent you a verification email click to "Gmail" to verify
                    </CardDescription>
                    <p className="text-center font-bold">{email}</p>
                    <CardContent className={"mt-3"}>
                        <div className="grid grid-cols-2 gap-4">
                            <Button disabled={loading === "verify-email"} onClick={handleResendVerificationEmail} variant={"outline"}>
                            {loading === "verify-email" ? <Loader2 className="animate-spin" /> : "Resend"}
                              
                            </Button>
                            <Button asChild>  
                                <Link href={"https://mail.google.com"}>
                                    Go to Gmail
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}