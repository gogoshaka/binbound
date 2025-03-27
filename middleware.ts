import { NextResponse, NextRequest } from 'next/server'
import { getSessionCookie } from "better-auth";
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './app/i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
}

const protectedRoutes = ['/benchmark']


export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) return NextResponse.next()
  let lng: string | undefined | null
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
  }
  console.log("MIDDLEWARE : "+req.nextUrl.pathname)
  if (req.nextUrl.pathname.includes('/p/')) {
    console.log('protected route')
    const sessionCookie = getSessionCookie(req); // Optionally pass config as the second argument if cookie name or prefix is customized.
    if (!sessionCookie) {
      return  Response.json(
        { success: false, message: 'authentication failed' },
        { status: 401 }
      )
    }
    else {
      console.log(sessionCookie)
    }
  }



  return response;
}