// the purpose of this file is to feed the link data to the store. it doees not display anything

'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store/store';
import * as LinkModel from '@/lib/models/LinkModel';

export function ClientSetLinksInStore({links} : {links: LinkModel.LinkWithSubmittedByUserPublicProfileType[]}) {
  const { setInitialLinks } = useStore((state) => ({
    setInitialLinks: state.setInitialLinks
  }));

  useEffect(() => {
    // Call hydrateLinks to initialize or rehydrate the links state
    setInitialLinks(links);
  }, [setInitialLinks]);

  return <div></div>;
}
