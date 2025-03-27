'use client';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react'

import { useTranslation } from '../../../i18n/client';
import { useStore } from '@/lib/store/store';



const initialState = {
    status: 0,
  }

interface RegisterForEventProps {
    lng: string;
    eventId: string;
}
export function RegisterForEvent({ lng, eventId}: RegisterForEventProps) {
    const { t } =  useTranslation(lng, 'ama');
    const router = useRouter();

    const { registerUserForEvent } = useStore((state) => ({
        registerUserForEvent: state.registerUserForEvent,
      }));

    const handleSubmit = async () => {
        const res = await registerUserForEvent(eventId);
        if (res.status === 401) {
            router.push('/' + lng + '/user/signin');
        }
      };
    
    
    
    return (
            <button
            onClick={handleSubmit}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
            Register
        </button>

    )

}

