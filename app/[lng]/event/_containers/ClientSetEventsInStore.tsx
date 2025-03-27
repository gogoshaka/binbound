// the purpose of this file is to feed the event data to the store. it doees not display anything

'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store/store';
import { Event } from '@prisma/client';

export default function ClientSetEventsInStore({events} : {events: Event[]}) {
  const { setInitialEvents, hydrateEventsRegisteredByUser } = useStore((state) => ({
    setInitialEvents: state.setInitialEvents,
    hydrateEventsRegisteredByUser: state.hydrateEventsRegisteredByUser,
  }));

  useEffect(() => {
    // Call hydrateEvents to initialize or rehydrate the events state
    setInitialEvents(events);
    hydrateEventsRegisteredByUser();
  }, [setInitialEvents, hydrateEventsRegisteredByUser]);

  return <div></div>;
}
