// the purpose of this file is to feed the event data to the store. it doees not display anything

'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store/store';

import * as EventModel from '@/lib/models/EventModel';
export default function ClientSetEventsInStore({events} : {events: EventModel.EventWithGuestsType[]}) {
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
