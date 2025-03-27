'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store/store';

export default function ClientHydrate() {
  const { hydrateEvents, hydrateEventsRegisteredByUser } = useStore((state) => ({
    hydrateEvents: state.hydrateEvents,
    hydrateEventsRegisteredByUser: state.hydrateEventsRegisteredByUser,
  }));

  useEffect(() => {
    // Call hydrateEvents to initialize or rehydrate the events state
    hydrateEvents();
    hydrateEventsRegisteredByUser();
  }, [hydrateEvents, hydrateEventsRegisteredByUser]);

  return <div></div>;
}