import { create } from "zustand";

interface UseLoginDialogProps {
  isOpen: boolean;

  onOpen: () => void;
  onClose: () => void;

  onChange: (state: boolean) => void;
}

export const useLoginDialog = create<UseLoginDialogProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),

  onChange: (state: boolean) => set({ isOpen: state }),
}));
