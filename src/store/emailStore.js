// src/store/emailStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useEmailStore = create(
    persist(
        (set) => ({
            emails: [],
            setEmails: (data) => set({ emails: data }),
            addEmail: (email) =>
                set((state) => ({ emails: [...state.emails, email] })),
            removeEmail: (id) =>
                set((state) => ({
                    emails: state.emails.filter((e) => e.id !== id),
                })),
            clearEmails: () => set({ emails: [] }),
        }),
        {
            name: "email-storage",
            getStorage: () => localStorage,
        }
    )
)
