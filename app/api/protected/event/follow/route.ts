import type { NextApiRequest, NextApiResponse } from 'next';
import {auth} from "@/lib/auth"
import { PrismaClient } from '@prisma/client';
import fs from 'fs';



const prisma = new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
      {
        emit: 'event',
        level: 'error',
      },
    ],
  });
  prisma.$on('query', (e) => {
    console.log(`Query: ${e.query}\nParams: ${e.params}\nDuration: ${e.duration}ms\n`);
  });
  
  prisma.$on('info', (e) => {
    console.log(`Info: ${e.message}\n`);
  });
  
  prisma.$on('warn', (e) => {
    console.log(`Warning: ${e.message}\n`);
  });
  
  prisma.$on('error', (e) => {
    console.log(`Error: ${e.message}\n`);
  });
export async function POST(req: Request, res: Response) {
    const session = await auth.api.getSession({
        headers: new Headers(req.headers as any)
    })
    console.log(session)

    if (!session) {
        return new Response('unauthorized', {
            status: 401
        })
    }

   // const { eventId } = req.body;
   const { eventId } = await req.json()
    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return new Response('user not found', {
                status: 404
            })
        }
        console.log(user)

        await prisma.event.update({
            where: { id: eventId },
            data: {
                users: {
                     connect: { id: user.id },
                },
            },
        });

        return new Response('Joined event successfully', {
            status: 200
        })

    } catch (error) {
        return new Response('Failed to join event', {
            status: 500
        })
    }
}