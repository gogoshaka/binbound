import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { createAuthMiddleware, APIError } from "better-auth/api";

 
const prisma = new PrismaClient();



export default prisma;
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    plugins: [
        emailOTP({ 
                async sendVerificationOTP({ email, otp, type}) { 
					// Implement the sendVerificationOTP method to send the OTP to the user's email address
				}, 
        }) 
    ],
    socialProviders: { 
       github: { 
            clientId: process.env.GITHUB_CLIENT_ID!, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
       },
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID!, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        microsoft: {   
            clientId: process.env.MICROSOFT_CLIENT_ID!, 
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
        }
    }, 
});