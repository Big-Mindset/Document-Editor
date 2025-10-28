"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useLoading } from "@/utils/LoadingContext";
import { emailSchema } from "@/utils/LoginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword(){
    let {loading , setLoading} = useLoading()
    let form = useForm({
        resolver : zodResolver(emailSchema),
        defaultValues : {
            email : ""
        }
    })
    let handleverifyemail = async ({email})=>{
        setLoading("verify")
         await authClient.requestPasswordReset({email,redirectTo : "http://localhost:3000/auth/reset-password"},{
            onSuccess : ()=>{

                toast.success("Verification Email sent to your email ")
            },onError : (error)=>{
                console.log(error);
                
                toast.error(error.error.message)
            }
         })
        
        setLoading(null)
    }
    return (
        <div className="flex justify-center  h-dvh items-center">
            <Card className={"max-w-lg w-full"}>
                <CardHeader>
                    <CardTitle>
                        Forgot Password
                    </CardTitle>
                    <CardDescription>
                        Verification otp will be sent to your email to reset the password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleverifyemail)}>


                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

              
                <Button disabled={loading === "verify"} className="w-full mt-3">
                    {loading === "verify" ? <Loader2 className="animate-spin" /> :
                        "Continue"}</Button>
            </form>
        </Form>     
                </CardContent>
            </Card>
        </div>
    )
}