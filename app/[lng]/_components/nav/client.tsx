'use client'

import { NavBase } from './NavBase'
import { useTranslation } from '../../../i18n/client'
// import { useParams } from 'next/navigation'

export function Nav({ lng, path = ''  }: {
  lng: string;
  path?: string;
}) {
  const { i18n } = useTranslation(lng, 'nav')
  return <NavBase i18n={i18n} lng={lng} path={path} />
}
