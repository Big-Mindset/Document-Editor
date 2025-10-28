import { betterAuth } from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma"
import { prisma } from "./prisma-client";
import { sendVerificaitonEmail } from "./emails/send-verification-email";
import { sendResetPasswordEmail } from "./emails/reset-password-email";
export const auth = betterAuth({
    trustedOrigins: [
    "http://localhost:3000",
    "https://*.vercel.app",  // ✅ This allows ALL Vercel preview URLs
  ],
    database: prismaAdapter(prisma,{
        provider : "mongodb"
    }),
    socialProviders : {
        google : {
            clientId : process.env.CLIENT_ID ,
            clientSecret : process.env.CLIENT_SECRET
        },
        github : {
            clientId : process.env.GITHUB_ID,
            clientSecret : process.env.GITHUB_SECRET
        }
    },
    user: {
        additionalFields : {
            image : {
                required : false,
                type : "string"
            }
        }
    },
    emailAndPassword: { 
    enabled: true, 
    requireEmailVerification : true,
    sendResetPassword : async ({user , url})=>{
        await sendResetPasswordEmail({user , url})
    },
    
  },
  emailVerification : {
    sendVerificationEmail : async ({user , url})=>{
        await sendVerificaitonEmail({user , url})
    },
    autoSignInAfterVerification : true
  }

});