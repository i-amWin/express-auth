import { User } from "@/lib/axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type UserStoreState = {
  user: User | null;
};

type UserStoreActions = {
  addUser: (user: User) => void;
  removeUser: () => void;
};

const useUserStore = create<UserStoreState & UserStoreActions>()(
  immer((set) => ({
    user: null,
    addUser: (user: User) => {
      set((state) => {
        state.user = user;
      });
    },
    removeUser: () => {
      set((state) => {
        state.user = null;
      });
    },
  }))
);

export const useUser = () => useUserStore((state) => state.user);

export const useAddUser = () => useUserStore((state) => state.addUser);

export const useRemoveUser = () => useUserStore((state) => state.removeUser);
