import { PrismaClient, Link as LinkType } from '@prisma/client';
import { authClient } from '@/lib/auth-client';
import { StateCreator } from 'zustand';
import * as LinkModel from '@/lib/models/LinkModel';
import { get } from 'http';

const prisma = new PrismaClient();

export type GlobalSliceState = {
    showSignInModal: boolean
  }
  
export type GlobalSliceActions = {
    setShowSignModal: (showSignInModal: boolean) => void
}
  
export type GlobalSlice =
    GlobalSliceState & GlobalSliceActions;
  
  // The slice is a function returning that combined shape
export const createGlobalSlice: StateCreator<
    GlobalSlice,
    [["zustand/devtools", never], ["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
    [],
    GlobalSlice
> = (set) => ({
        showSignInModal: false,
        setShowSignModal: (showSignInModal: boolean) => {
            set({showSignInModal});
        }
    });