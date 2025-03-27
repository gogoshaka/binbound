import { PrismaClient, Event, Question } from '@prisma/client';
import { authClient } from '@/lib/auth-client';
import { StateCreator } from 'zustand';
import * as EventModel from '@/lib/models/EventModel';
import { get } from 'http';

const prisma = new PrismaClient();

export type EventSliceState = {
    event: Event | null
    events: Event[]
    questions: Question[]
    eventsRegisteredByUser: string[] // list of event ids
  }
  
export type EventSliceActions = {
    hydrateEvents: () => Promise<void>
    hydrateEventsRegisteredByUser: () => Promise<void>
    registerUserForEvent: (eventId: string) => Promise<{status: number}> // 200 for success, 401 for not authenticated
    joinUserForTheEvent: (eventId: string) => Promise<{status: number}> // 200 for success, 401 for not authenticated, 403 if the event has not satrted yet
    setInitialEvents: (events: Event[]) => void
    setEvent: (eventId: string) => void;
    fetchQuestions: (eventId: string) => Promise<void>;
    askQuestion: (eventId: string, question: string) => Promise<void>;
    voteQuestion: (questionId: string) => Promise<void>;
}
  
export type EventSlice =
    EventSliceState & EventSliceActions;
  
  // The slice is a function returning that combined shape
export const createEventSlice: StateCreator<
    EventSlice,
    [["zustand/devtools", never], ["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
    [],
    EventSlice
> = (set, get) => ({
    event: null,
    events: [],
    eventsRegisteredByUser: [],
    questions: [],
    hydrateEvents: async () => {
        const events = await EventModel.getEvents();
        set({ events });
    },
    hydrateEventsRegisteredByUser: async () => {
        const { data: session } = await authClient.getSession();
        if (!session) {
            set({eventsRegisteredByUser : []});
        }
        const res = await EventModel.getEventsRegisteredByUserPublicProfile();
        // don't redirect to sign-in for 401, this is not a call to action to sign in
        if (res.status !== 200) {
            set({eventsRegisteredByUser : []});
        } else {
            set({eventsRegisteredByUser : res.data});
        }
    },
    registerUserForEvent: async (eventId: string) : Promise<{status: number}> => {
        const res = await EventModel.registerUserPublicProfileForEventServerAction(eventId)
        if (res.status == 200) {
            get().hydrateEventsRegisteredByUser()
        }
        return res
      },
    setEvent: (eventId: string) => {
        set({event: get().events.find((event) => event.id === eventId)});
    },
    setInitialEvents: (events: Event[]) => {
        set({events: events});
    },
    joinUserForTheEvent: async (eventId: string) : Promise<{status: number}>  => {
        get().setEvent(eventId)
        const res = await EventModel.joinUserForTheEvent(eventId)
        return res
    },
    fetchQuestions: async (eventId: string) => {
        const questions = await EventModel.getQuestions(eventId);
        set({ questions });
      },
      askQuestion: async (eventId: string, question: string) => {
        await EventModel.askQuestion(eventId, question);
        get().fetchQuestions(eventId);
      },
      voteQuestion: async (questionId: string) => {
        await EventModel.voteQuestion(questionId);
        get().fetchQuestions(get().event!.id);
      },
});