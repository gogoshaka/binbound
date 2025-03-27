'use server'
import { Event } from '@prisma/client';
import { useTranslation } from '../../../i18n';



export const EventTime = async ({ lng, event }: { lng: string, event: Event }) => {

    const { t } = await useTranslation(lng, 'ama');
    const visitorTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneCity = visitorTimezone.split('/')[1];
    const eventDate = new Date(event.scheduledAtUTC);
    const is24HourFormat = !['en-US', 'en-GB', 'en-CA', 'en-AU', 'en-NZ'].includes(navigator.language);
    const eventTimeInVisitorTimezone = eventDate.toLocaleString('en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24HourFormat,
        timeZone: visitorTimezone,
      });

    return (
            <div>
                <div className="text-3xl uppercase">{eventTimeInVisitorTimezone.split(',')[0]}</div>
                <div className="text-xl uppercase">{eventTimeInVisitorTimezone.split(',')[1]}</div>
                <div className="text-sm">{t('time_of')} {timezoneCity}</div>
            </div>
    )




}