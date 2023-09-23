import { BigNumberish } from "ethers";
import { create } from "zustand";

interface ModalData {
  sortCategory?: string;
  sortDirection?: string;
}

interface SortModal {
  data: ModalData;
  isOpen: boolean;
  onOpen: (data?: ModalData) => void;
  onClose: (data?: ModalData) => void;
}

export const useSortModal = create<SortModal>((set) => ({
  data: {
    sortCategory: "Wszystkie",
    sortDirection: "asc",
  },
  isOpen: false,
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: (data = {}) => set({ isOpen: false, data }),
}));
