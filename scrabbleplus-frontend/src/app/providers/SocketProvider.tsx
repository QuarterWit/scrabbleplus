import { ReactNode, useEffect } from "react";

// Minimal no-op socket provider (wire socket.io-client later)
export default function SocketProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // TODO: init sockets here
  }, []);
  return <>{children}</>;
}
