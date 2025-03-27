import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import { connect } from 'http2';
import { resolve } from 'path';

const prisma = new PrismaClient();



async function createLinks() {
    const links: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/Link.csv')
            .pipe(csv())
            .on('data', (row) => {
                links.push({
                    id: row.id,
                    submittedByUserPublicProfileId: row.submittedByUserPublicProfileId,
                    submittedAtUTC: new Date(row.submittedAtUTC),
                    url: row.url,
                    title: row.title,
                    upVoteCount: parseInt(row.upVoteCount),
                    downVoteCount: parseInt(row.downVoteCount),
                    tags: row.tags.split(',').map((tag: string) => (tag.trim())),
                    summary: row.summary,
                });
            })
            .on('end', async () => {
                try {
                    for (const link of links) {
                        const existingLink = await prisma.link.findFirst({
                            where: { id: link.id },
                        });

                        if (!existingLink) {
                            await prisma.link.create({
                                data: {
                                    id: link.id,
                                    submittedAtUTC: link.submittedAtUTC,
                                    url: link.url,
                                    title: link.title,
                                    upVoteCount: link.upVoteCount,
                                    downVoteCount: link.downVoteCount,
                                    summary: link.summary,
                                    submittedByUserPublicProfile: {
                                        connect: { id: link.submittedByUserPublicProfileId },
                                    },
                                    tags: {
                                        connectOrCreate: link.tags.map((tag: any) => ({
                                            where: { id: tag },
                                            create: { id: tag },
                                        })),
                                    },
                                },
                            });
                        }
                    }
                    console.log('Links have been seeded');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
async function createAnswers() {
    const answers: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/Answer.csv')
            .pipe(csv())
            .on('data', (row) => {
                answers.push({
                    id: row.id,
                    questionId: row.questionId,
                    answer: row.answer,
                    answeredByUserPublicProfileId: row.answeredByUserPublicProfileId,
                    answeredAtUTC: new Date(row.answeredAtUTC),
                })
            })
            .on('end', async () => {
                try {
                    for (const answer of answers) {
                        const existingAnswer = await prisma.answer.findUnique({
                            where: { 
                                id: answer.id,
                            },
                        });
    
                        if (!existingAnswer) {
                            await prisma.answer.create({
                                data: answer,
                            });
                        }
                    }
                    resolve()
                    console.log('Answers have been seeded');
                }
                catch (error) {
                    reject(error);
                 }

            })
            .on('error', (error) => {
                reject(error);
              });
        })
    }
async function createQuestions() {
    const questions: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/Question.csv')
            .pipe(csv())
            .on('data', (row) => {
                questions.push({
                    id: row.id,
                    question: row.question,
                    eventId: row.eventId,
                    askedByUserPublicProfileId:  row.askedByUserPublicProfileId,
                    askedAtUTC: new Date(row.askedAtUTC),
                    validated: row.validated === 'true',
                })
            })
            .on('end', async () => {
                try{ 
                    for (const question of questions) {
                        const existingQuestion = await prisma.question.findUnique({
                            where: { 
                                id: question.id,
                            },
                        });

                        if (!existingQuestion) {
                            await prisma.question.create({
                                data: {
                                    id: question.id,
                                    question: question.question,
                                    askedAtUTC: question.askedAtUTC,
                                    validated: question.validated,
                                    event: {
                                        connect: { id: question.eventId },
                                    },
                                    askedByUserPublicProfile: {
                                        connect: { id: question.askedByUserPublicProfileId },
                                    },

                                }
                            });
                        }
                    }
                    resolve();
                    console.log('Questions have been seeded');
                } catch (error) {
                    reject(error);
                 }
            })
            .on('error', (error) => {
                reject(error);
              });
        })

}

async function createGuests() {
    const guests: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/Guest.csv')
            .pipe(csv())
            .on('data', (row) => {
                guests.push({
                    userPublicProfileId: row.userPublicProfileId,
                    eventId: row.eventId,
                    presentationOrder: parseInt(row.presentationOrder)
                })
            })
            .on('end', async () => {
                try {
                    for (const guest of guests) {
                        const existingGuest = await prisma.guest.findFirst({
                            where: { 
                                userPublicProfileId: guest.userPublicProfileId,
                                eventId: guest.eventId
                            },
                        });
                        if (!existingGuest) {
                            await prisma.guest.create({
                                data: {
                                    presentationOrder: parseInt(guest.presentationOrder),
                                    userPublicProfile: {
                                        connect: { id: guest.userPublicProfileId },
                                    },
                                    event: {
                                        connect: { id: guest.eventId }
                                    }
                                }
                            });
                        }
                    }
                    resolve();
                    console.log('Guests have been seeded');
                } catch (error) {
                    reject(error);
                 }
            })
            .on('error', (error) => {
                reject(error);
              });
        })
    }


async function createEvents() {
    const events: any[] = [];
    return new Promise<void>((resolve, reject) => {
        fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/Event.csv')
            .pipe(csv())
            .on('data', (row) => {
                events.push({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    scheduledAtUTC: new Date(row.scheduledAtUTC),
                })
            })
            .on('end', async () => {
                try {
                    for (const event of events) {
                        const existingEvent = await prisma.event.findUnique({
                            where: { id: event.id },
                        });
    
                        if (!existingEvent) {
                            await prisma.event.create({
                                data: event,
                            });
                        }
                    }
                    console.log('Events have been seeded');
                    resolve();
                } catch (error) {
                    reject(error);
                 }

            })
            .on('error', (error) => {
                reject(error);
              });
    })
    }
async function createUsers() {
    const users: any[] = [];
    return new Promise<void>((resolve, reject) => {
    fs.createReadStream('/Users/gogo/projects/semanticmaker/nextjs/prisma/seed/User.csv')
        .pipe(csv())
        .on('data', (row) => {
            users.push({
                id: row.id,
                name: row.name,
                password: row.password,
                email: row.email,
                emailVerified: row.emailVerified === 'true',
                image: row.image,
                createdAt: new Date(row.createdAt),
                updatedAt: new Date(row.updatedAt),
                publicProfile : {
                    create: { 
                        linkedinUrl: row.linkedinUrl,
                        twitterUrl: row.twitterUrl,
                        githubUrl: row.githubUrl,
                        youtubeUrl: row.youtubeUrl,
                        position: row.position,
                        organizationName: row.organizationName,
                        organizationUrl: row.organizationUrl,
                        bio: row.bio,
                        personalWebsite: row.personalWebsite,
                        pictureUrl: row.pictureUrl,
                     }
                },
            });
        })
        .on('end', async () => {
            try {
                for (const user of users) {
                    const existingUser = await prisma.user.findUnique({
                        where: { email: user.email },
                    });
    
                    if (!existingUser) {
                        await prisma.user.create({
                            data: user,
                        });
                    }
                }
                resolve();
                console.log('Users have been seeded');
            } catch (error) {
                reject(error);
             }

            
        })
        .on('error', (error) => {
            reject(error);
          });
    })
}


async function main() {

    await createUsers();
    await createEvents();
    await createGuests();
    await createQuestions();
    await createAnswers();
    await createLinks();
    prisma.$disconnect();
    // Add other seeding functions here
}

main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});