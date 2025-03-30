
import React from 'react';


import { getEvents } from "@/lib/models/EventModel";
import Links from "../link/_containers/Links";


// see with API, it's sthe same issue: https://blog.jonrshar.pe/2024/Dec/24/nextjs-prisma-docker.html
export const dynamic = "force-dynamic"; // use it otherwise docker compose will fail because it tries tro pre-render this page and fails because postgresl server is not reachable. see: https://github.com/prisma/prisma/discussions/14187

type Params =  Promise<{ lng: string }>
export default async function IndexPage(props: { params: Params }) {
  const params = await props.params;
  const { lng } = params
  const events = await getEvents();
  console.log(events);



return (
  <div className="flex flex-col items-center min-h-screen">
  <div className="flex flex-col items-center">
  <h1 className="mt-18 text-3xl text-center">CyberSecurity content that matters</h1>
  <h2 className="text-sm text-gray-500 uppercase mt-2">Curated from LinkedIn, Twitter, BlueSky, Mastodon, Medium and others</h2>
    <div className="flex text-gray-500 mt-10 text-md mr-1 flex-wrap items-center justify-center" style={{ fontFamily: 'concourse_c3' }}>
      <span className="mr-2">Exploits</span>
      <span className="mx-2">Vulnerabilities</span>
      <span className="mx-2">Write-up</span>
      <span className="mx-2">Pentest report</span>
      <span className="mx-2">Red team</span>
      <span className="mx-2">Incident Response</span>
      <span className="mx-2">Cloud Security</span>
      <span className="ml-2">Endpoint security</span>
      <span className="mx-2">Network security</span>
      <span className="mx-2">Web security</span>
      <span className="mx-2">OSINT</span>
      <span className="mx-2">Threat hunting</span>
      <span className="mx-2">Threat Intelligence</span>
      <span className="mx-2">Malware analysis</span>
      <span className="mx-2">Digital forensics</span>
      <span className="mx-2">Security operations</span>
      <span className="mx-2">Data security</span>
      <span className="mx-2">Compliance</span>
    </div>
    <h2 className="mt-10 mb-10">No Noise. Just the signal.</h2>


    {/*}
    <div className="menu flex space-x-4">
      <div>Cybersecurity</div>
      <div>Data science</div>
      <div>Cloud infrastructure</div>
      <div>Software development</div>
      <div>Devops</div>
    </div>
   

    <div className="menu flex space-x-4">
      <div className="text-md">Upcoming sessions</div>
      <div className="text-md">Previous sessions</div>
    </div>

 */
  }

  </div>
  <div className="mt-10">
    <Links lng={ lng } />
    

    {/* events.map((event, index) => (
      <EventItem key={index} event={event} lng={lng} eventAlreadyRegisteredByUser={isEventRegisteredByUser(event.id)} /> 
    )) */}
  </div>




</div>
);



}