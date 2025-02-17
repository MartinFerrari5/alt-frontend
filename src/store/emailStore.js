// src/store/emailStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useEmailStore = create(
    persist(
        (set) => ({
            emails: [],
            setEmails: (emails) => set({ emails }),
            addEmail: (email) =>
                set((state) => ({ emails: [...state.emails, email] })),
            updateEmail: (updatedEmail) =>
                set((state) => ({
                    emails: state.emails.map((email) =>
                        email.id === updatedEmail.id ? updatedEmail : email
                    ),
                })),
            removeEmail: (id) =>
                set((state) => ({
                    emails: state.emails.filter((email) => email.id !== id),
                })),
            clearEmails: () => set({ emails: [] }),
        }),
        {
            name: "email-storage",
            getStorage: () => localStorage,
        }
    )
)
