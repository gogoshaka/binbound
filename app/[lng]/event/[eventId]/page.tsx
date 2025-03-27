'use server'

import { useTranslation } from "@/app/i18n";
import * as EventModel from '@/lib/models/EventModel';
import { Event } from "@prisma/client";
import { useStore } from "@/lib/store/store";
import { use, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import Questions from "./_containers/Questions";
import NotFound from "@/app/[lng]/_components/NotFound";
import SocialIconLinkedIn from "../../_components/social/LinkedIn";
import SocialIconTwitter from "../../_components/social/Twitter";
import SocialIconYoutube from "../../_components/social/Youtube";
import SocialIconGithub from "../../_components/social/Github";
import { EventTime } from "../_containers/EventTime";
import { UserActionOnEvent } from "../_containers/UserActionOnEvent";
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
  const event: Event = res.data as Event;




      return (
        <div>
          <EventItem lng={lng} event={event} />
          <Questions lng={lng} eventId={eventId} />
        </div>
        
      );
}




