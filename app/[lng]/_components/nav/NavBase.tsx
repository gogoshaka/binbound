'use server'
import { i18n } from 'i18next'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import styles from "@/app/styles/layout.module.css";
import { headers } from 'next/headers';
import { SignOutButton } from './SignOutButton';



export const NavBase = async ({ i18n, lng, path = '' }: { i18n: i18n, lng: string, path?: string }) => {
    const t = i18n.getFixedT(lng, 'nav')



  return (
    <nav  className={`${styles.nav} hidden sm:flex uppercase text-l text-gray-600`}>
      <Link
        className={`${styles.link} mr-2 ${path === "/" ? styles.active : ""}`}
        href="/"
      >
        {t('home')}
      </Link>
      <Link
        className={`${styles.link} mr-2 ${
          path === "/verify" ? styles.active : ""
        }`}
        href="/privacy"
      >
        {t('privacy')}
      </Link>
      <Link
        className={`${styles.link} mr-6 ${
          path === "/quotes" ? styles.active : ""
        }`}
        href="/who-we-are"
      >
        {t('who_we_are')}
      </Link>
      <SignOutButton lng={lng} />
    </nav>
  );
};
