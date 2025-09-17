import { ReactNode } from "react";

// Minimal no-op provider for now (you can swap to @tanstack/react-query later)
export default function QueryProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
