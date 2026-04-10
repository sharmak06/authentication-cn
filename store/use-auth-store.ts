import { create } from "zustand";
import type { Profile } from "@/types/database";

type AuthState = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
