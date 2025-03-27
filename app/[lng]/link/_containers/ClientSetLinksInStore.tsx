// the purpose of this file is to feed the link data to the store. it doees not display anything

'use client';

import { useEffect } from 'react';
import { Link as LinkType} from '@prisma/client';
import { useStore } from '@/lib/store/store';

export function ClientSetLinksInStore({links} : {links: LinkType[]}) {
  const { setInitialLinks } = useStore((state) => ({
    setInitialLinks: state.setInitialLinks
  }));

  useEffect(() => {
    // Call hydrateLinks to initialize or rehydrate the links state
    setInitialLinks(links);
  }, [setInitialLinks]);

  return <div></div>;
}
