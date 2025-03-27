'use client'

import { LogoBase } from './LogoBase'
import { useTranslation } from '../../../i18n/client'
// import { useParams } from 'next/navigation'

export function Logo({ lng }: {
  lng: string;
}) {
  const { i18n } = useTranslation(lng, 'logo')
  return <LogoBase i18n={i18n} lng={lng} />
}
