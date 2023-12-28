import { create } from "zustand";

interface ModalData {
  listingType?: string;
  price?: number;
  title?: string;
  description?: string;
  image?: string;
  id: string;
  assetContractAddress: string;
}

interface ModalStore {
  data: ModalData;
  isOpen: boolean;
  onOpen: (data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  data: {
    id: "0",
    assetContractAddress: "",
  },
  isOpen: false,
  onOpen: (
    data = {
      id: "0",
      assetContractAddress: "",
    }
  ) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false }),
}));
