import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionCookie } from "better-auth";
import { CustomMiddleware } from './chainMiddlewares';
 

export function withAuthMiddleware(middleware: CustomMiddleware): CustomMiddleware {
	return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
		if (request.nextUrl.pathname.startsWith('/auth')) {
			const sessionCookie = getSessionCookie(request); // Optionally pass config as the second argument if cookie name or prefix is customized.
			if (!sessionCookie) {
				return NextResponse.redirect(new URL("/sign-in", request.url));
			}
		}
		return middleware(request, event, response);
	}
}
 