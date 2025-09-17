// src/App.tsx
import LandingPage from "./pages/landing/LandingPage";
import QueryProvider from "./app/providers/QueryProvider";
import StoreProvider from "./app/providers/StoreProvider";
import SocketProvider from "./app/providers/SocketProvider";

export default function App() {
  return (
    <StoreProvider>
      <QueryProvider>
        <SocketProvider>
          <LandingPage />
        </SocketProvider>
      </QueryProvider>
    </StoreProvider>
  );
}
