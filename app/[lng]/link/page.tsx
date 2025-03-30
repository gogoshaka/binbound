import { LinkItem } from "./_containers/LinkItem";
import * as LinkModel from "@/lib/models/LinkModel"
import { ClientSetLinksInStore } from './_containers/ClientSetLinksInStore';

// see with API, it's sthe same issue: https://blog.jonrshar.pe/2024/Dec/24/nextjs-prisma-docker.html
export const dynamic = "force-dynamic"; // use it otherwise docker compose will fail because it tries tro pre-render this page and fails because postgresl server is not reachable. see: https://github.com/prisma/prisma/discussions/14187

type Params =  Promise<{ lng: string }>
export default async function Links(props: { params: Params }) {
    const params = await props.params;
    const { lng } = params
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