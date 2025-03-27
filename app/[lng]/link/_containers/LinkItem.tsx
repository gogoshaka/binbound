import { useTranslation } from '@/app/i18n';
import Link from 'next/link';
import { LinkWithSubmittedByUserPublicProfileType } from '@/lib/models/LinkModel';

import { LinkActions } from './LinkActions';
import { timeAgo } from '@/lib/utils';

interface LinkItemProps {
  lng: string;
  link: LinkWithSubmittedByUserPublicProfileType
}

export async function LinkItem({ lng, link }: LinkItemProps) {
  const { t } = await useTranslation(lng, 'ama');
  //const routeToLink = routes.link(link.);

  return (
    <div className="flex flex-col mb-4">
        <Link href={link.url}>
            <span className="uppercase font-bold">{link.title}</span>
        </Link>
        <div className="flex flex-row text-gray-600 text-sm">
          <div>
            submitted by {link.submittedByUserPublicProfile.name}
          </div>
          <div className='ml-2'>
              {timeAgo(link.submittedAtUTC)}
          </div>
        </div>
        <div>
          <span className='text-justify'>{link.summary}</span>
        </div>
        <div className="flex flex-wrap mt-2">
          {link.tags.map((tag, index) => (
            <span key={index} className="text-gray-500 text-md mr-1" style={{ fontFamily: 'concourse_c3' }}>
              {tag.id}
            </span>
          ))}
        </div>
      
      <LinkActions lng={lng} link={link} />
      </div>
  );
}

export default LinkItem;