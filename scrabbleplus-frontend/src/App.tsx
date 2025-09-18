// src/App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/Header";
import LandingPage from "./pages/landing/LandingPage";
import GamePage from "./pages/game/GamePage";
import { useSlideDirection } from "./pages/hooks/useSlideDirection";
import StoreProvider from "./app/providers/StoreProvider";
import QueryProvider from "./app/providers/QueryProvider";
import SocketProvider from "./app/providers/SocketProvider";

export default function App() {
  return (
    <StoreProvider>          {/* MUST be here */}
      <QueryProvider>
        <SocketProvider>
          <BrowserRouter>
            <div className="flex flex-col h-screen">
              <Header />     {/* now inside Provider */}
              <main className="flex-1 min-h-0 overflow-hidden">
                <RouteTransitions />
              </main>
            </div>
          </BrowserRouter>
        </SocketProvider>
      </QueryProvider>
    </StoreProvider>
  );
}

function RouteTransitions() {
  const location = useLocation();
  const dir = useSlideDirection();
  const enterX = dir === 'forward' ? 40 : -40;
  const exitX  = dir === 'forward' ? -40 : 40;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ x: enterX, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: exitX, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.8 }}
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

