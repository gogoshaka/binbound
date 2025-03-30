import type { Metadata } from "next";

import { useTranslation } from '../../i18n'


type Params =  Promise<{ lng: string }>
export default async function Privacy(props: { params: Params }) {
  const params = await props.params;
  const { lng } = params
  const { t } = await useTranslation(lng, 'nav')
    return (
      <div>Privacy</div>
    )
  }
