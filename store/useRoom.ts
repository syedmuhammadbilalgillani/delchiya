// useRoomStore.ts
import { create } from "zustand";

interface RoomStore {
  adults: number;
  children: number;
  linnedCount: number;
  linnedChecked: boolean;
  basePrice: number;
  rengoring: number;
  checkin: string | null;
  checkout: string | null;
  totalPrice: number;
  discount: number;

  setAdults: (adults: number) => void;
  setChildren: (children: number) => void;
  setLinnedCount: (linnedCount: number) => void;
  setLinnedChecked: (linnedChecked: boolean) => void;
  setBasePrice: (basePrice: number) => void;
  setRengoring: (rengoring: number) => void;
  setCheckin: (checkin: string | null) => void;
  setCheckout: (checkout: string | null) => void;
  setTotalPrice: (totalPrice: number) => void;
  setDiscount: (discount: number) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  adults: 0,
  children: 0,
  linnedCount: 0,
  linnedChecked: false,
  basePrice: 0,
  rengoring: 0,
  checkin: null,
  checkout: null,
  totalPrice: 0,
  discount: 0,

  setAdults: (adults) => set({ adults }),
  setChildren: (children) => set({ children }),
  setLinnedCount: (linnedCount) => set({ linnedCount }),
  setLinnedChecked: (linnedChecked) => set({ linnedChecked }),
  setBasePrice: (basePrice) => set({ basePrice }),
  setRengoring: (rengoring) => set({ rengoring }),
  setCheckin: (checkin) => set({ checkin }),
  setCheckout: (checkout) => set({ checkout }),
  setTotalPrice: (totalPrice) => set({ totalPrice }),
  setDiscount: (discount) => set({ discount }),
}));
