import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { EventItem } from "./EventItem";
import { useStore } from "@/lib/store/store";
import * as EventModel from "@/lib/models/EventModel";


export interface EventsProps {
    lng: string;
    events: EventModel.EventWithGuestsType[];
}
export async function Events(params: Promise<EventsProps>) {
    const { lng, events } = await params;
    
    /*
    const { events, eventsRegisteredByUser } = useStore(useShallow((state) => ({
       events: state.events,
       eventsRegisteredByUser: state.eventsRegisteredByUser,
    })));
    */
    
    
    return (
        <div>
        <div className="mt-10">
        {events.map((event, index) => (
          <EventItem 
            key={index} 
            event={event} 
            lng={lng} 
          />
        ))}
      </div> 
      </div>
    )
}