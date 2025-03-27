'user server'
import type { NextApiRequest, NextApiResponse } from 'next';
import {authClient} from  "@/lib/auth-client"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { data: session } = await authClient.getSession()

    if (!session) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const { eventId } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await prisma.event.update({
            where: { id: eventId },
            data: {
                users: {
                    connect: { id: user.id },
                },
            },
        });

        res.status(200).json({ message: 'Joined event successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join event' });
    }
}