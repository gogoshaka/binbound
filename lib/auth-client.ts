import { createAuthClient } from "better-auth/react"
import { emailOTPClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    baseURL: process.env.BASE_URL,// the base url of your auth server
    plugins: [
        emailOTPClient()
    ] 
})

