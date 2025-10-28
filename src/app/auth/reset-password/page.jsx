"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useLoading } from "@/utils/LoadingContext";
import { emailSchema, passwordSchema } from "@/utils/LoginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {  useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPassword(){
    let params = useSearchParams()
    let token = params.get("token")
        let router = useRouter()
    let {loading , setLoading} = useLoading()
    let form = useForm({
        resolver : zodResolver(passwordSchema),
        defaultValues : {
            password : "",
            confirmPassword : ""

        }
    })
    let handleResetPasswrod = async (data)=>{
        setLoading("reset")
         await authClient.resetPassword({newPassword : data.password,token},{
            onSuccess : ()=>{

                toast.success("Password reset Successfully")
                router.push("auth/login")
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
                        Reset Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleResetPasswrod)}>


                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter the new password" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Confirm the password" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

              
                <Button disabled={loading === "reset"} className="w-full mt-3">
                    {loading === "reset" ? <Loader2 className="animate-spin" /> :
                        "Reset Password"}</Button>
            </form>
        </Form>     
                </CardContent>
            </Card>
        </div>
    )
}