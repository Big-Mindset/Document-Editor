"use client"

import { useEffect, useState } from "react"
import SignIn from "./_components/sign-in"
import SignUp from "./_components/sign-up"
import { GithubIcon, GoogleIcon, Logo } from "@/assets/svgs"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useLoading } from "@/utils/LoadingContext"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import verificationEmail from "./_components/verification-email"
import VerificationEmail from "./_components/verification-email"
import { useRouter } from "next/navigation"

export default function login() {
    let [page, setPage] = useState(true)
    let router= useRouter()
    let [verifyEmail , setVerifyEmail] = useState("")
    let { loading, setLoading } = useLoading()
    let {data} = authClient.useSession()
    let handleSocialLogin = async (provider) => {
        setLoading(provider)
        await authClient.signIn.social({ provider, callbackURL: "/", })
        setLoading(null)

    }
    console.log(data);
    useEffect(()=>{
        if (data !== null) router.push("/")
    },[data])
   
    return <div className="h-dvh flex justify-center items-center">

        <div className="w-[400px] ">
            {verifyEmail ? <VerificationEmail email={verifyEmail} /> : 
            <div className="space-y-6">

                <div className="flex justify-center">
                    <p className="font-bold  text-[1.7rem]">

                        {page ? "Sign in" : "Sign up"}
                    </p>
                </div>
                <div className="w-full bg-[#191919] border border-[#303030]  rounded-xl">
                    <div className="p-6">

                        {page ? <SignIn setVerifyEmail={setVerifyEmail} /> : <SignUp setVerifyEmail={setVerifyEmail} />}

                        <div className="flex justify-center  my-4 ">or</div>
                        <div className="grid grid-rows-2 gap-3">

                            <Button disabled={loading === "google"} onClick={() => handleSocialLogin("google")} variant={"outline"}>
                                {loading === "google" ? <Loader2 className="animate-spin" /> :

                                    <>
                                        {GoogleIcon}
                                        <span>

                                            Continue with Google
                                        </span>
                                    </>
                                }
                            </Button>
                            <Button disabled={loading === "github"} onClick={() => handleSocialLogin("github")} variant={"outline"}>
                                {loading === "github" ? <Loader2 className="animate-spin" /> :
                                    <>
                                        {GithubIcon}
                                        < span >

                                            Continue with Github
                                        </span>
                                    </>
                                }
                            </Button>
                        </div>
                        <div className="mt-3 text-center">
                       <span className="text-gray-300 text-sm ">{!page ? "Already have an Account" : "Don't have an Account"}</span>
                        <Button onClick={()=>setPage(!page)} className="p-2" variant={"link"}>{page ? "Sign up" : "Sign in"}</Button>
                        </div>
                        
                    </div>

                </div>
            </div>}
        </div>
    </div >
}