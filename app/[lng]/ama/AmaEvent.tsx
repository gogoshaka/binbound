'use client'
import { useTranslation } from '../../i18n';
import { AmaEventProps } from '@/types/ama';

export async function AmaEvent({ lng, amaEvent}: {amaEvent: AmaEventProps, lng: string}) {
    const { t } = await useTranslation(lng, 'ama');

    const joinAmaEvent = async () => {
        console.log('join evenett');
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
                <button onClick={() => joinAmaEvent()} className="bg-black hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Join
                </button>
            </div>

            </div>
        </div>
    )
}