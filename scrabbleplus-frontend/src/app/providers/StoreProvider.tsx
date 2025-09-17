import { ReactNode } from "react";

// Minimal no-op store provider (swap to Redux/Zustand later)
export default function StoreProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
