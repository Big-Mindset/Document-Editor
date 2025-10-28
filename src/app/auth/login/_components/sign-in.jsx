"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/utils/LoginSchemas";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/utils/LoadingContext";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SignIn({ setVerifyEmail }) {
    let { loading, setLoading } = useLoading()
    let form = useForm({
        resolver: zodResolver(SignInSchema),
        defaultValues: { email: "", password: "" }
    })
    let handleSignIn = async (data) => {
        setLoading("sign-in")
        await authClient.signIn.email({ ...data, callbackURL: "/" }, {
            onError: (error) => {
                toast.error(error.error.message || "Failed to sign in")
                if (error.error.status === 403) {
                    authClient.sendVerificationEmail({ email: data.email })
                    setVerifyEmail(data.email)
                }
            }
        })
        setLoading(null)


    }
    return <div>
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>


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
                            <div className="flex justify-between items-center">
                                <FormLabel> Password</FormLabel>
                                <Button variant='link' asChild>
                                    <Link  href="forgor-password">
                                        forgot password
                                    </Link>
                                </Button>
                            </div>
                            <FormControl>
                                <Input placeholder="Enter your password"  {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={loading === "sign-in"} className="w-full mt-3">
                    {loading === "sign-in" ? <Loader2 className="animate-spin" /> :
                        "Sign In"}</Button>
            </form>
        </Form>
    </div>

}