// src/store/emailStore.js
import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useEmailStore = create(
    persist(
        (set) => ({
            emails: [],
            isLoading: false,
            error: null,
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
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: "email-storage",
            getStorage: () => localStorage,
        }
    )
)
