// /src/store/navigationStore.js
import { create } from "zustand"

const useNavigationStore = create((set) => ({
    // Current active route
    activeRoute: "dashboard",

    // Admin menu expanded state
    adminMenuExpanded: false,

    // Set active route
    setActiveRoute: (route) => set({ activeRoute: route }),

    // Toggle admin menu
    toggleAdminMenu: () =>
        set((state) => ({ adminMenuExpanded: !state.adminMenuExpanded })),

    // Close admin menu
    closeAdminMenu: () => set({ adminMenuExpanded: false }),
}))

export default useNavigationStore
