import { PrismaClient } from '@prisma/client';
import { StateCreator } from 'zustand';
import * as LinkModel from '@/lib/models/LinkModel';
import {StoreType} from '@/lib/store/store';


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
StoreType,
    [["zustand/devtools", never], ["zustand/subscribeWithSelector", never], ["zustand/immer", never]],
    [],
    GlobalSlice
> = (set) => ({
        showSignInModal: false,
        setShowSignModal: (showSignInModal: boolean) => {
            set({showSignInModal});
        }
    });