import { auth } from "@/lib/auth"
import findIp from "@arcjet/ip"
import arcjet, { detectBot, protectSignup, shield, slidingWindow } from "@arcjet/next"
import { toNextJsHandler } from "better-auth/next-js"

let authHandler = toNextJsHandler(auth)
export const { GET } = authHandler
let aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        shield({ mode: "LIVE" }),
    ],
    characteristics: ["userIdOrIp"]
})
export async function POST(request) {
    let cloneRequest = request.clone()
    let decision = await ArjectProtection(request)
    let message = ""
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return new Response(null, { status: 429 })
        } else if (decision.reason.isEmail()) {
            if (decision.reason.emailTypes.includes("INVALID")) {
                message = "Email format is invalid"
            } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
                message = "Disposable email addresses are not allowed"
            } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
                message = "Email domain is not valid"
            } else {
                message = "Invalid email"
            }
            return  Response({ message }, { status: 400 })
        }
        return new Response(null, {status : 403})
    }
    return authHandler.POST(cloneRequest)
}
    async function ArjectProtection(request) {
        let body;
        try {
            body = request.json()
        } catch (error) {
            body = {}

        }
        let session = await auth.api.getSession({ headers: request.headers })
        let botSettings = {
            mode: "LIVE",
            allow: []
        }
        let RestrictiveRateLimitSettings = {
            mode: "LIVE",
            max: 10,
            interval: "10m"
        }
        let LaxRateLimitSettings = {
            mode: "LIVE",
            max: 60,
            interval: "1m"
        }
        let emailSettings = {
            mode: "LIVE",
            block: ["INVALID", "DISPOSABLE", "NO_MX_RECORDS"]
        }
        let userIdOrIp = (session?.user?.id ?? findIp(request)) || "127.0.0.1"
        if (request.url.endsWith("/auth/sign-up")) {
            if (body && typeof body === "object" && "email" in body && typeof body.email === "string") {
                return aj.withRule(protectSignup({
                    bots: botSettings,
                    email: body.email,
                    rateLimit: RestrictiveRateLimitSettings,
                    email: emailSettings
                })).protect(request, { email: body.email, userIdOrIp })
            } else {
                return aj.withRule(detectBot(botSettings)).withRule(slidingWindow(RestrictiveRateLimitSettings)).protect(request, { userIdOrIp })
            }
        }
        return aj.withRule(detectBot(botSettings)).withRule(slidingWindow(LaxRateLimitSettings)).protect(request, { userIdOrIp })
    }