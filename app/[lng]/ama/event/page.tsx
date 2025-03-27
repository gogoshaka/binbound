'use client'
import { useRouter } from 'next/navigation'
import { useTranslation } from '../../../i18n';
import { useEffect, useState } from 'react';

import { AmaEventProps } from '@/types/ama';

export default function Page({ lng, eventId}: {eventId: string, lng: string}) {
    //const { t } =  useTranslation(lng, 'ama');
    const router = useRouter();
    const [amaEvent, setAmaEvent] = useState<AmaEventProps | null>(null);


    async function followEvent() {
        try {
            const res = await fetch('/api/protected/event/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ eventId }),
            });

            if (res.status === 401) {
                router.push('/user/signin');
            } else {
                const data = await res.json();
                console.log(data.message);
            }
        } catch (err) {
            console.log(err)
            console.log('Failed to follow event');
        }
    }

    async function getEvent(id: string): Promise<AmaEventProps> {
        return {
          name: 'Jane Doe',
          job: 'Data Scientist',
          company: 'Facebook',
          introduction: 'I\'m Ava Mitchell, a software engineer at Meta specializing in Oculus, where I create innovative features for virtual reality experiences. My journey began with a passion for 3D graphics and design, driving me to push the boundaries of immersive technology. Outside of work, I mentor aspiring engineers to foster diversity in tech.',
          date: '2022-01-02',
          timezone: 'PST'
        };
      }
    useEffect(() => {
        async function fetchEvent() {
          try {
            const event = await getEvent(eventId);
            setAmaEvent(event);
          } catch (err) {
            console.log('Failed to fetch event');
          }
        }
    
        fetchEvent();
      }, [eventId]);



    if (!amaEvent) {
    return <div>Loading...</div>;
    }
    
    return (
        <div className='mt-4'>
          <div className="flex">
            <div className='w-52 flex-shrink-0'>
                <div>{amaEvent.name}</div>
                <div>{amaEvent.job}</div>
                <div>{amaEvent.company}</div>
            </div>
            <div className='flex-grow'>
                <div>{amaEvent.introduction}</div>
            </div>
            <div className='w-52 flex-shrink-0 text-right'>
                <div>{amaEvent.date}</div>
                <div>{amaEvent.timezone}</div>
                <button 
                    className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => followEvent()}
                >
                    Follow
                </button>
            </div>

            </div>
        </div>
    )
}