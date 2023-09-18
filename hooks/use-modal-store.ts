import { BigNumberish } from "ethers";
import { create } from "zustand";

interface ModalData {
  listingType?: string;
  price?: number;
  title?: string;
  description?: string;
  image?: string;
  id: BigNumberish;
}

interface ModalStore {
  data: ModalData;
  isOpen: boolean;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  data: {
    id: 0,
  },
  isOpen: false,
  onOpen: (
    data = {
      id: 0,
    }
  ) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
