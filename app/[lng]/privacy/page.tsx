import type { Metadata } from "next";

import { useTranslation } from '../../i18n'


export default async function IndexPage({ params: { lng } }: {
  params: {
    lng: string;
  };
}) {
const { t } = await useTranslation(lng, 'nav')
  return (
    <div>Privacy</div>
  )
}

export const metadata: Metadata = {
  title: "lemonjohn",
};