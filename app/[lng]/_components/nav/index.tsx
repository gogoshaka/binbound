
import { useTranslation } from '../../../i18n'
import { NavBase } from "./NavBase";

export async function Nav({ lng, path = ''  }: {
  lng: string;
  path?: string;
}) {
  const { t, i18n } = await useTranslation(lng, 'nav')
  return <NavBase i18n={i18n} lng={lng} path={path} />
}



