'use server'

import { useTranslation } from "@/app/i18n";
import * as EventModel from '@/lib/models/EventModel';
import Questions from "./_containers/Questions";
import NotFound from "@/app/[lng]/_components/NotFound";
import { EventItem } from "../_containers/EventItem";


export type EventProps = {
    lng: string;
    eventId: string;
};
export default async function (props : {params : Promise<EventProps>}) {
  const params = await props.params;
  const {lng, eventId} = params
  const { t } = await useTranslation(lng, 'ama');
  EventModel.joinUserForTheEvent(eventId);
  const res = await EventModel.getEvent(eventId);
  if (res.status === 404) {
    return <NotFound />; // Render the 404 page
  }
  const event: EventModel.EventWithGuestsType = res.data as EventModel.EventWithGuestsType;




      return (
        <div>
          <EventItem lng={lng} event={event} />
          <Questions lng={lng} eventId={eventId} />
        </div>
        
      );
}




