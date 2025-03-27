import type { Metadata } from "next";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Link from 'next/link';
import { auth } from '@/lib/auth';

import { headers } from 'next/headers';
import React from 'react';
import { PrismaClient, Event } from '@prisma/client';

import { useRef } from 'react';
import { useTranslation } from '../../i18n';

import { get } from "http";
import { getEvents } from "@/lib/models/EventModel";
import { EventItem } from "../event/_containers/EventItem";
import { Events } from "../event/_containers/Events";
import ClientSetEventsInStore from "../event/_containers/ClientSetEventsInStore";
import Links from "../link/page";



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
    <Links params={{ lng }} />
    

    {/* events.map((event, index) => (
      <EventItem key={index} event={event} lng={lng} eventAlreadyRegisteredByUser={isEventRegisteredByUser(event.id)} /> 
    )) */}
  </div>




</div>
);



}