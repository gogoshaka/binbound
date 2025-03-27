import { auth } from '@/lib/auth';
import { useTranslation } from '../../../i18n';
import { PrismaClient, Event } from '@prisma/client';
import Link from 'next/link';
import { RegisterForEvent } from './RegisterForEvent';
import { headers } from 'next/headers';
import { JoinTheEvent } from './JoinTheEvent';
import SocialIconLinkedIn from '../../_components/social/LinkedIn';
import { UserActionOnEvent } from './UserActionOnEvent';
import SocialIconTwitter from '../../_components/social/Twitter';
import SocialIconYoutube from '../../_components/social/Youtube';
import SocialIconGithub from '../../_components/social/Github';
import {EventTime} from './EventTime'
import routes from '@/lib/routes';



export async function EventItem({ lng, event}: {event: Event, lng: string}) {
    const { t } = await useTranslation(lng, 'ama');
    /*
    const { events, eventsRegisteredByUser } = useStore((state) => ({
        events: state.events,
        eventsRegisteredByUser: state.eventsRegisteredByUser,
    }));
    */



    const routeToEvent = routes.event(event.id);
    return (
        <div className='mt-8'>
          <div className="flex">
            <div className='w-36 flex-shrink-0 bg-gray-200 p-4 mr-4 rounded-sm'>
                <EventTime event={event} lng={lng} />
                <div className="mt-4">
                    <UserActionOnEvent lng={lng} event={event} />
                </div>
            </div>
            <div className='flex-grow text-justify'>
                <div className="text-md font-bold uppercase mb-2">{event.title}</div>
                <div className='flex flex-col md:flex-row space-y-2'>
                {event.guests.map((guest, index) => (
                        <div key={index} className='flex flex-col space-x-2 text-md'>
                            <div className="">
                                {guest.userPublicProfile.name}, 
                            </div>
                            <div>{guest.userPublicProfile.position} at {guest.userPublicProfile.organizationName}</div>
                            <div className="flex space-x-2">
                                {guest.userPublicProfile.linkedinUrl && <SocialIconLinkedIn linkedInProfileUrl={guest.userPublicProfile.linkedinUrl}/> }
                                {guest.userPublicProfile.twitterUrl && <SocialIconTwitter twitterProfileUrl={guest.userPublicProfile.twitterUrl}/> }
                                {guest.userPublicProfile.youtubeUrl && <SocialIconYoutube youtubeProfileUrl={guest.userPublicProfile.youtubeUrl}/> }
                                {guest.userPublicProfile.githubUrl && <SocialIconGithub githubProfileUrl={guest.userPublicProfile.githubUrl}/> }
                            </div>
                        </div>
                ))}
                </div>
                <div className='mt-4'>{event.description}</div>
                <div>
                <Link className="text-md underline" href={routeToEvent} passHref>
                    <span className='text-teal-700 underline'>Already 4 questions asked: see them</span>
                </Link>
                </div>
            </div>
            </div>
        </div>
    )};