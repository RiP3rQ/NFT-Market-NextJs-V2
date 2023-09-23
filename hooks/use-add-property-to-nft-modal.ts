import { BigNumberish } from "ethers";
import { create } from "zustand";

interface AttributesData {
  propertyName?: string;
  propertyValue?: string;
}

interface AddPropertyModal {
  data: AttributesData;
  isOpen: boolean;
  onOpen: (data?: AttributesData) => void;
  onClose: (data?: AttributesData) => void;
}

export const useAddPropertyToNftModal = create<AddPropertyModal>((set) => ({
  data: {},
  isOpen: false,
  onOpen: (data = {}) => set({ isOpen: true, data }),
  onClose: (data = {}) => set({ isOpen: false, data }),
}));
