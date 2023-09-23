import { BigNumberish } from "ethers";
import { create } from "zustand";

interface ModalData {
  sortCategory?: string;
  sortDirection?: string;
}

interface SortModal {
  data: ModalData;
  isOpen: boolean;
  onOpen: () => void;
  onClose: (data?: ModalData) => void;
}

export const useSortModal = create<SortModal>((set) => ({
  data: {},
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: (data = {}) => set({ isOpen: false, data }),
}));
