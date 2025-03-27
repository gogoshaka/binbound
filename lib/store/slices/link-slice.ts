import { PrismaClient, Link as LinkType } from '@prisma/client';
import { authClient } from '@/lib/auth-client';
import { StateCreator } from 'zustand';
import * as LinkModel from '@/lib/models/LinkModel';
import { get } from 'http';

const prisma = new PrismaClient();

export type LinkSliceState = {
    link: LinkType | null
    links: LinkType[]
  }
  
export type LinkSliceActions = {
    setInitialLinks: (links: LinkType[]) => void
    updateLink: (link: LinkType) => Promise<void>
    upvoteLink: (link: LinkType) => Promise<void>
    setLink: (linkId: string) => void;
}
  
export type LinkSlice =
    LinkSliceState & LinkSliceActions;
  
  // The slice is a function returning that combined shape
export const createLinkSlice: StateCreator<
    LinkSlice,
    [["zustand/devtools", never], ["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
    [],
    LinkSlice
> = (set, get) => ({
    link: null,
    links: [],
    setLink: (linkId: string) => {
        set({link: get().links.find((link) => link.id === linkId)});
    },
    setInitialLinks: (links: LinkType[]) => {
        set({links: links});
    },
    updateLink: async (link: LinkType) => {
        // find linkId in links and replace it with the new link
        const index = get().links.findIndex((linkInArray) => link.id === linkInArray.id);
        if (index !== -1) {
            const links = [...get().links];
            links[index] = link;
            set({ links });
        }    
    },
    upvoteLink: async (link: LinkType) => {
        const res = await LinkModel.voteLink({linkId: link.id, upVote: true});
        if (res.status === 401) {
            // call setShowSignModal defined in global-slice.ts
            const { setShowSignModal } = get() as any;
            setShowSignModal(true);
        }
        if (res.status === 200) {
            link.upVoteCount = link.upVoteCount + 1;
            get().updateLink(link);
        }
    },
});