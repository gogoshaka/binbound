'use client';
import Link from 'next/link';

import { useTranslation } from '../../../i18n/client';
import routes from '@/lib/routes';


interface JoinTheEventProps {
    lng: string;
    eventId: string;
}
export function JoinTheEvent({ lng, eventId}: JoinTheEventProps) {
    const { t } =  useTranslation(lng, 'ama');

    const eventLink = routes.event(eventId);
 
    
    
    return (
        <Link href={eventLink} passHref>
        <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
            Join
        </button>
        </Link>



    )

}

