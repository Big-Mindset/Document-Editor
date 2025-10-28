"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/utils/LoginSchemas";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/utils/LoadingContext";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUp({setVerifyEmail}) {
    let { loading, setLoading } = useLoading()
    let router = useRouter()
    let form = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: { email: "", password: "", name: "" }
    })
    let handleSignUp = async (data) => {
        setLoading("sign-up")
        await authClient.signUp.email({ ...data}, {
            onError: (error) => {
                toast.error(error.error.message || "Failed to sign up")
            },
            onSuccess : ()=>{
                setVerifyEmail(data.email)
            }
        })
        setLoading(null)


    }
    return <div>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>


                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your password" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <Button disabled={loading === "sign-up"} className="w-full mt-3">
                {loading === "sign-up" ? <Loader2 className="animate-spin" />  : 
                "Sign Up"}</Button>
            </form>
        </Form>
    </div>

}