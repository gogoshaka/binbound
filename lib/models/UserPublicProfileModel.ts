'use server'
import { headers } from 'next/headers';
import { auth } from '../auth';
import { PrismaClient, Prisma } from '@prisma/client';
// @ts-ignore
import { UserPublicProfile as UserPublicProfileType } from '@prisma/client';

// @ts-ignore
const userPublicProfileValidator = Prisma.validator<Prisma.UserPublicProfileDefaultArgs>()
  

export const createUserPublicProfileIfNotExists = async () : Promise<{status: 200 | 401, data?: UserPublicProfileType}>  => {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
        return {
            status: 401,
        }
    }
    const prisma = new PrismaClient()
    const userPublicProfile = await prisma.userPublicProfile.findFirst({
        where: {
            id: session.user.id,
        },
    })
    if (userPublicProfile) {
        return {
            status: 200,
            data: userPublicProfile
        }
    }
    const newUserPublicProfile = await prisma.userPublicProfile.create({
        data: {
            user: {
                connect: { id: session.user.id },
              },
        },
    })
    return {
        status: 200,
        data: newUserPublicProfile
    }

}
