// src/store/sidebarStore.js
import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  adminDropdownOpen: false,
  toggleAdminDropdown: () =>
    set((state) => ({ adminDropdownOpen: !state.adminDropdownOpen })),
}));

export default useSidebarStore;
