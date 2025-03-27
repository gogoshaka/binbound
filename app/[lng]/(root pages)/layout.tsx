
import { dir } from 'i18next';
import { useTranslation } from '../../i18n';

import { languages, fallbackLng } from '../../i18n/settings';

import Image from "next/image";
import type { ReactNode } from "react";

import "@/app/styles/globals.css";
import styles from "@/app/styles/layout.module.css";
import { Logo } from '../_components/logo';
import { Nav } from '../_components/nav';




type Params =  Promise<{ lng: string }>
interface Props {
  readonly children: ReactNode,
  params: Params
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}



export default async function Layout({ children, params}: Props) {
  const { lng } = await params;


  return (
    <div>
      {children}
    </div>
    

  );
}
