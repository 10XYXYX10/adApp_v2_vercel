// src/store/index.ts
import { AuthUser } from '@/lib/types/auth/authTypes'
import { create } from 'zustand'

const initialData: AuthUser = {
   id: 0,
   name: '',
   userType: '',
   amount: 0,
}

type State = {
 user: AuthUser
 updateUser: (payload: AuthUser | ((prev: AuthUser) => AuthUser)) => void //(payload: AuthUser) => void
 resetUser: () => void
 notificationCount: number
 setNotificationCount: (count: number) => void
 decrementNotificationCount: () => void
}

const useStore = create<State>((set) => ({
 user: initialData,
  updateUser: (payload) =>
    set((state) => ({
      user: typeof payload === "function" ? payload(state.user) : payload,
    })
  ),
  resetUser: () => set({ 
    user: initialData,
    notificationCount: 0
  }),
 
 notificationCount: 0,
 setNotificationCount: (count) => set({ notificationCount: count }),
 decrementNotificationCount: () => set((state) => ({ 
   notificationCount: Math.max(0, state.notificationCount - 1)
 })),
}))

export default useStore