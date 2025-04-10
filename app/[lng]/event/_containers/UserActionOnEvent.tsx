'use client'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from "@/lib/store/store";
import { useTranslation } from "@/app/i18n/client";
import { RegisterForEvent } from './RegisterForEvent';
import * as EventModel from "@/lib/models/EventModel";


export function UserActionOnEvent({ lng, event}: {event: EventModel.EventWithGuestsType, lng: string}) {
    const { t } = useTranslation(lng, 'ama');
    const { eventsRegisteredByUser } = useStore(useShallow((state) => ({
        eventsRegisteredByUser: state.eventsRegisteredByUser,
     })));
    return (
        <div>
        {!eventsRegisteredByUser.includes(event.id) ? (
            <RegisterForEvent lng={lng} eventId={event.id} />   
        ) : (
            <span className="bg-gray-300 text-gray-500 font-bold mt-2 py-1 px-4 rounded">
                Registered
            </span>
        )}
        {/* <JoinTheEvent lng={lng} eventId={event.id} /> */}


        </div>

    )
}