
import { dir } from 'i18next';
import { useTranslation } from '../i18n';

import { languages, fallbackLng } from '../i18n/settings';

import Image from "next/image";
import type { ReactNode } from "react";

import "@/app/styles/globals.css";
import styles from "@/app/styles/layout.module.css";
import localFont from 'next/font/local'
import { Metadata } from 'next';
import ClientHydrate from './_containers/ClientHydrate';
import { Logo } from './_components/logo';
import { Nav } from './_components/nav';
import { Sign } from 'crypto';
import { SignInModal } from './_components/signin/SignInModal';



const concourse_t3_regular = localFont({
  src: '../styles/fonts/concourse_t3_regular.woff',
  variable: '--font-concourse-t3',
  display: 'swap',
})




type Params =  Promise<{ lng: string }>
interface Props {
  readonly children: ReactNode,
  params: Params
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}


export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const params = await props.params;
  let { lng } = params
  if (languages.indexOf(lng) < 0) lng = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng)
  return {
    title: 'BinBound',
  }
}

export default async function RootLayout({ children, params}: Props) {
    const { lng } = await params;

  return (
      <html lang={lng} dir={dir(lng)} className={` flex flex-col items-center text-gray-700 ${concourse_t3_regular.variable}`}>
        <body className="w-full max-w-6xl">
          <div className="px-4">
          <SignInModal lng={lng} />
          <ClientHydrate />
          <section>
            <header className={`px-10 sm:px-0 flex justify-between items-center`}>
                <Logo lng={lng} />
                <Nav  lng={lng} />
            </header>
            <main className={`px-10 sm:px-0`}>{children}</main>
          </section>
          </div>          
        </body>
      </html>
  );
}
