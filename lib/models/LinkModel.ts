

'use server'

import { PrismaClient, Prisma } from '@prisma/client'
import { headers } from 'next/headers'
import { auth } from '../auth'
import { redirect } from 'next/dist/server/api-utils'
import { stat } from 'fs'
import { get } from 'http'

const prisma = new PrismaClient()

// @ts-ignore
const linkWithSubmittedByUserPublicProfile = Prisma.validator<Prisma.LinkDefaultArgs>()({
  include: { 
    submittedByUserPublicProfile: true,
    tags: true,
  },
})

// @ts-ignore
export type LinkWithSubmittedByUserPublicProfileType = Prisma.LinkGetPayload<typeof linkWithSubmittedByUserPublicProfile>

export async function getLinks() : Promise<{status: 200 | 404, data?: LinkWithSubmittedByUserPublicProfileType[]}> {
  const links = await prisma.link.findMany({
    include: {
        submittedByUserPublicProfile: true,
        tags: true,
    },
    })
    if (!links) {
        return {
          status: 404
        }
        }
      return {
        status: 200,
        data: links
      }
}

export async function getLink(linkId: string) : Promise<{status: 200 | 404, data?: LinkWithSubmittedByUserPublicProfileType}> {
  // include only the attribute name from the user

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: {
        submittedByUserPublicProfile: true,
        tags: true,
    }
  })  
  if (!link) {
    return {
      status: 404
    }
    }
  return {
    status: 200,
    data: link
  }
}

  export async function voteLink({linkId, upVote}: {linkId: string, upVote: boolean}) : Promise<{status: 200 | 404 | 401}> {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return {
        status: 401
      }
    }
    const res = await prisma.linkVote.create({
      data: {
        userPublicProfile: {
          connect: { id: session.user.id },
        },
        link: {
            connect: { id: linkId },
        },
        upVote
      },
    });
    if (!res) {
      return {
        status: 404
      }
    } else {
        return {
            status: 200
        }
    }
  }