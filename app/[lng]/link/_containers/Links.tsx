'use server'
import { LinkItem } from "./LinkItem";
import * as LinkModel from "@/lib/models/LinkModel"
import { ClientSetLinksInStore } from './ClientSetLinksInStore';



export default async function Links({lng} : {lng: string}) {

    const res = await LinkModel.getLinks();
    let links : LinkModel.LinkWithSubmittedByUserPublicProfileType[] = []
    if (res.status !== 200) {
        throw new Error('Failed to fetch links');
    } else {
        links = res.data!;
    }
    
    /*
    const { links, linksRegisteredByUser } = useStore(useShallow((state) => ({
       links: state.links,
       linksRegisteredByUser: state.linksRegisteredByUser,
    })));
    */
    
    
    return (
        <div>
        <div className="mt-10">
        {links.map((link: LinkModel.LinkWithSubmittedByUserPublicProfileType, index: number) => (
          <LinkItem 
            key={index} 
            link={link} 
            lng={lng} 
          /> 
        ))}
      </div> 
      <ClientSetLinksInStore links={links} /> {/* this is to feed the store with the events fecthed from the DB. Avoid to fetch twice the DB, and avoid a client component */}
      </div>
    )
}