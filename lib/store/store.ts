import { createWithEqualityFn as create } from 'zustand/traditional'
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";

import { createEventSlice, EventSlice } from "./slices/event-slice";
import { createLinkSlice, LinkSlice } from "./slices/link-slice";
import { createGlobalSlice, GlobalSlice } from "./slices/global-slice";

// ...

// 1) Build an overall Store type
export type Store = EventSlice  & LinkSlice & GlobalSlice // & InsuranceSlice /* ...more slices */;

// 2) Actually create the store
export const useStore = create<Store>()(
  devtools(
      subscribeWithSelector(
        immer((...args) => ({
          ...createEventSlice(...args),
          ...createLinkSlice(...args),
          ...createGlobalSlice(...args)
          // ...
        }))
      ),
    { name: "Devtools" }
    )
);