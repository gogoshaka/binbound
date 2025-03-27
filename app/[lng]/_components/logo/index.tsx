


import { useTranslation } from '../../../i18n'
import { LogoBase } from "./LogoBase";

export async function Logo({ lng}: {
  lng: string;
  path?: string;
}) {
  const { t, i18n } = await useTranslation(lng, 'logo')
  return <LogoBase i18n={i18n} lng={lng} />
}



