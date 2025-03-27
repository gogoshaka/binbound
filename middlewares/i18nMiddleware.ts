import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from '../app/i18n/settings'
import { CustomMiddleware } from './chainMiddlewares';

acceptLanguage.languages(languages)


export function i18nMiddleware(middleware: CustomMiddleware): CustomMiddleware {
  return async (request: NextRequest, event: NextFetchEvent, response: NextResponse) => {
    if (request.nextUrl.pathname.indexOf('icon') > -1 || request.nextUrl.pathname.indexOf('chrome') > -1) return NextResponse.next()
      let lng: string | undefined | null
      if (request.cookies.has(cookieName)) lng = acceptLanguage.get(request.cookies.get(cookieName)?.value)
      if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
      if (!lng) lng = fallbackLng
    
      // Redirect if lng in path is not supported
      if (
        !languages.some(loc => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !request.nextUrl.pathname.startsWith('/_next')
      ) {
        return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
      }
    
      if (request.headers.has('referer')) {
        const refererUrl = new URL(request.headers.get('referer') || '')
        const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
        console.log(response)
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
      }

      return middleware(request, event, response);

  }

}