import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { UserAuthenticationService } from "@/lib/services/UserAuthenticationService";
import { UserAuthentication } from "@/lib/models/UserAuthentication";

interface Context {
  params: undefined;
}

export async function GET(request: NextRequest, context: Context) {
    let authtoken = request.nextUrl.searchParams.get("authtoken");
    let emailhash = request.nextUrl.searchParams.get("emailhash");
    const userAuthenticationService = UserAuthenticationService.getInstance();
    const jwt = await userAuthenticationService.authenticateUser(emailhash!, authtoken!);
    if (jwt != null) {
        const response =  NextResponse.json({
            status: 200
        });
        response.cookies.set({ 
            name: 'jwt',
            value: jwt,
            httpOnly: true,
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * UserAuthentication.JWT_EXPIRATION_DAYS)
          });
        return response;
    } else {
        return NextResponse.json(
            { error: "failed to validate" },
            {
              status: 401,
            }
        );
    }
}