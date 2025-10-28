"use client"

import {z} from "zod"

export let SignInSchema = z.object({
    email : z.email().min(1,{error : "Email is required"}),
    password : z.string().min(6,{error : "Password must be atleast 6 characters"})
})
export let SignUpSchema = z.object({
    email : z.email().min(1,{error : "Email is required"}),
    password : z.string().min(6,{error : "Password must be atleast 6 characters"}),
    name : z.string().min(1,{error : "Name is required"})
})

export let emailSchema = z.object({
    email : z.email().min(1,{error : "Email is required"}),

})

export let passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], 
  }); 