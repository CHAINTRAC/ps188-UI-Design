import { create } from "zustand";

export const useNetworkStore = create((set) => ({
  serverDown: false,
  setServerDown: (serverDown) => set({ serverDown }),
}));
