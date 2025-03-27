

'use server'

import { PrismaClient, Prisma, Event } from '@prisma/client'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { redirect } from 'next/dist/server/api-utils'
import { stat } from 'fs'
import { get } from 'http'

const prisma = new PrismaClient()

// 1: Define a type that includes the relation to `Post`
const eventWithGuests = Prisma.validator<Prisma.EventDefaultArgs>()({
  include: { guests: {include : {userPublicProfile : true}} },
})

// 3: This type will include a user and all their posts
export type EventWithGuestsType = Prisma.EventGetPayload<typeof eventWithGuests>

export async function getEvents() : Promise<EventWithGuestsType[]> {
  const events = await prisma.event.findMany({
    include: {
      guests: {
        include: {
          userPublicProfile: true,
        },
      },
    },
  });
  return events;
}

export async function getEvent(eventId: string) : Promise<{status: 200 | 404, data?: EventWithGuestsType}> {
  // include only the attribute name from the user

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      guests: {
        include: {
          userPublicProfile: true
        },
      },
    },
  })  
  if (!event) {
    return {
      status: 404
    }
    }
  return {
    status: 200,
    data: event
  }
}

export async function joinUserForTheEvent(eventId: string) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return {
            status: 401
        }
    }
    if (!eventId) {
      return {
          status: 400,
          message: "Event ID is required"
      }
  }
    const user = await prisma.user.findUnique({
        where: { id: session!.user.id },
    });
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });
    if (!user || !event) {
        return {
            status: 404
        }
    }
    if (new Date(event.scheduledAtUTC) > new Date()) {
        return {
            status: 403
        }
    }
    await prisma.event.update({
        where: { id: eventId },
        data: {
          joinedUserPublicProfiles: {
            connect: { id: session.user.id },
          },
        },
      })
      return {
        status: 200
    }
}

export async function getEventsRegisteredByUserPublicProfile() {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return {
            status: 401
        }
    }
    const userPublicProfile = await prisma.userPublicProfile.findUnique({
        where: { id: session!.user.id },
        include: { registeredEvents: true },
    });
    return {
        status: 200,
        data: userPublicProfile?.registeredEvents.map(registeredEvent => registeredEvent.id) || []
    }
  }

  export async function registerUserPublicProfileForEventServerAction(eventId: string) : Promise<{status: number}> {
    if (!eventId) {
        return {
            status: 400
        }
    } 
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return {
            status: 401
        }
    }
    await prisma.event.update({
        where: { id: eventId },
        data: {
          registeredUserPublicProfiles: {
            connect: { id: session.user.id },
          },
        },
      })
      return {
        status: 200
    }
  }

  export async function getQuestions(eventId: string) {
    /*
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error('Not authenticated');
    }
      */
    return await prisma.question.findMany({
      where: { eventId },
      include: {
        votedByUserPublicProfiles: {
          select: {
            id: true,
          },
        },
        askedByUserPublicProfile: true
      },
    });
  }
  
  export async function askQuestion(eventId: string, question: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error('Not authenticated');
    }
    await prisma.question.create({
      data: {
        question,
        eventId,
        askedByUserPublicProfileId: session.user.id,
        askedAtUTC: new Date(),
        validated: false,
      },
    });
  }
  
  export async function voteQuestion(questionId: string) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      throw new Error('Not authenticated');
    }
    await prisma.question.update({
      where: { id: questionId },
      data: {
        votedByUserPublicProfiles: {
          connect: { id: session.user.id },
        },
      },
    });
  }