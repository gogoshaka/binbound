'use server'
import { headers } from 'next/headers';
import { auth } from '../auth';
import { PrismaClient, UserPublicProfile } from '@prisma/client';

export const createUserPublicProfileIfNotExists = async () : Promise<{status: 200 | 401, data?: UserPublicProfile}>  => {
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
